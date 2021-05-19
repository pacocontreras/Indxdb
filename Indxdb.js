class Inxdb{
    bd = null;
    nom = "";
    ver = 1;
    con = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    constructor(nom="inxdba",ver="1",conte=[],del=[],func="") {
        this.nom = nom;
        this.ver = ver;
        this.bd = this.con.open(nom,ver);
        this.bd.onupgradeneeded = function (e) {
            let active = e.currentTarget.result;
            let object = null;
            // creamos los contenedores
            for(let c=0; c<conte.length; c++) {
                if (!active.objectStoreNames.contains(conte[c].nom)) {
                    object = active.createObjectStore(conte[c].nom, { keyPath : conte[c].key, autoIncrement : conte[c].auto });
                    for(let i=0; i<conte[c].index.length; i++) {
                        object.createIndex(conte[c].index[i].cod, conte[c].index[i].nom, conte[c].index[i].options);
                    }
                }
            }
            // contenedores a borrar
            for(let d=0; d<del.length; d++) {
                if (active.objectStoreNames.contains(del[d])) { active.deleteObjectStore(del[d]); }
            }
        };
        this.bd.onerror = function (e) { alert('Error creando la base de datos'); }
        this.bd.onsuccess = function (e) {
            console.log('Base de datos creada'); 
            // iniciamos el proceso con la base de datos
            if(func !== "") { window[func](); }
        }
    }
    listado(acc,con,ind,tipo,rango,dat,func) {
        let bd = this.bd.result;
        let bdmodo = "readwrite";
        if(acc === "load" || acc === "info") { bdmodo = "readonly"; }
        let bddata = bd.transaction([con], bdmodo);
        let bdprev = bddata.objectStore(con);
        let bdobj = bdprev;
        if(ind !== "" && acc !== "edd" && acc !== "busc") { bdobj = bdprev.index(ind); }
        let bdrequest = null;
        let datbusc = dat;
        switch(acc) {
            default:
                // buscar registros por defecto todos
                dat = [];
                bdobj.openCursor().onsuccess = function (e) {
                    let result = e.target.result;
                    if (result === null) { return; }
                    let valido = true;
                    if(acc === "busc") {
                        // solo algunos
                        let rdat = result.value;
                        if(rango === "full") {
                            if(rdat[ind] !== datbusc) { valido = false; }
                        }else{
                            if(rdat[ind].indexOf(datbusc) === -1) { valido = false; }
                        }
                    }
                    if(valido) { dat.push(result.value); }
                    result.continue();
                };
                break;
            case "info": case "edd":
                // solo uno
                if(acc === "edd") { datbusc = dat[ind]; }
                if(tipo === "string") {
                    bdrequest = bdobj.get(String(datbusc));
                }else{
                    bdrequest = bdobj.get(parseInt(datbusc));
                }
                break;
            case "add": bdrequest = bdobj.put(dat); break;
            case "del": bdrequest = bdobj.delete(dat); break;
        }
        if(bdrequest !== null) {
            bdrequest.onerror = function (e) {
                alert(bdrequest.error.name + '\n\n' + bdrequest.error.message);
            };
            bdrequest.onsuccess = function(e) {
                if(acc === "edd") {
                    // actualizamos el objeto
                    let bdrequestUpdate = bdobj.put(dat);
                    bdrequestUpdate.onerror = function(event) { console.log("Error actualizando objeto"); };
                    bdrequestUpdate.onsuccess = function(event) { console.log("Actualizado objeto"); };
                }
            }
        }
        bddata.oncomplete = function (e) {
            switch(acc) {
                case "info": dat = bdrequest.result;  break;
            }
            if(func !== "") { window[func]({acc:acc,con:con,dat:dat}); }
        };
    }
}