# Indxdb
Manejo de bases de datos indexedDB.
La clase opera sobre un solo contenedor cada vez, aunque indexedDB permite hacer una transacción a varios contenedores a la vez.

Para usar la clase en el html tener un script una vez inciado el documento:
<script>
var idb = null;
var basedat = {
    nom: "idbprob",
    ver: 1,
    inic: 'iniciadaBD',
    conte: [
                {
                    nom:"personas",
                    key:"id",
                    auto:true,
                    index:[
                        {cod:"name",nom:"name",options:{unique:false}},
                        {cod:"dni",nom:"dni",options:{unique:true}}
                    ]
                }
    ],
    delconte: []
 }
 window.onload = function() { 
    // nom,ver,conte,funcfin
    idb = new Inxdb(basedat.nom,basedat.ver,basedat.conte,basedat.delconte,basedat.inic);
 }       
 </script>
 Una vez se ha creado la base de datos la clase llama a la función inic si es diferente de "".
 en esa función se colocan las acciones una vez que sabemos que la base ed datos esta activa en el objeto en que la hemos instanciado.
 Para trabajar sobre la base de datos usamos la función listado de la clase, a la que le pasamos:
 acción:  load (listado de todos los objetos de un contenedor), info (datos de un objeto), busc (busqueda completa o parcial de un texto en un contenedor),
          add (añadir un objeto al contenedor), edd (actualizar un objeto con los datos que le pasamos), del (borrar un objeto del contenedor).
 El nombre del contenedor sobre el que se actua.
 El indice o propiedad en la que se hace un filtro o búsqueda.
 El tipo de dato de la propiedad en la que se filtra: string o number.
 El rango o amplitud de la busqueda: full (coincidencia completa) o vacio (para que incluya el texto).
 El dato a buscar.
 La función a ejecutar una vez se ha realizado la acción, devolviendole un objeto que tiene la acción, el contenedor y los datos recogidos.

