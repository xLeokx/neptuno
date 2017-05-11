var loopback = require('loopback');
var ds = loopback.createDataSource('mysql', {
  "host": "localhost",
  "port": 3306,
  "database": "Neptuno",
  "username": "root",
  "password": "alumno"
});

var
  fs = require('fs'),
  path = require('path'),
  outputPath = path.resolve(__dirname, '../../common/models');

console.log('running auto discover...');

// discover and build models from each table.

function schemaCallback(err, schemas) {
  if (err) {
    console.error(err);
  }
  if (schemas) {
    console.log(schemas);
    for (var i = 0; i < schemas.length; i++) {
      var nombre=schemas[i].name;
      console.log(schemas[i].name);
      // Discover and build models from INVENTORY table
      ds.discoverAndBuildModels(nombre, {
          visited: {},
          associations: true
        },
        function(err, model) {
          var definition = model[0].definition;
          console.log(model);
          if (true) {
            var outputName = outputPath + '/' + nombre + '.json';
            fs.writeFile(outputName, JSON.stringify(definition, null, 2), function(err) {
              if (err) {
                console.log('Error writing schema to file.');
                console.log(err);
              } else {
                console.log("JSON saved to " + outputName);
              }
            });
          }
        });
    }

  }
}

// Discover and build models from INVENTORY table
ds.discoverModelDefinitions({
  "schema": 'Neptuno',
  "all": true,
  "relations": true
}, schemaCallback);