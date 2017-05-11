'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var initialization = function() {
  var fs = require('fs');
  var path = require('path');
  var outputPath = path.resolve(__dirname, '../../common/models');
  var configPath = path.resolve(__dirname, '../../server');

  var datasource = loopback.createDataSource('mysql', {
    "host": "localhost",
    "port": 3306,
    "database": "Neptuno",
    "username": "root",
    "password": "alumno"
  });

  var modelsFile = new Promise((resolve, reject) => fs.readFile('server/model-config.json', function(error, content) {
    if (error) console.log(error);
    else {
      var jsonModels = JSON.parse(content);
      resolve(jsonModels);
    }
  }));

  datasource.discoverModelDefinitions({
    schema: 'Neptuno',
    views: false,
    all: true
  }, function(error, models) {
    if (error) console.log(error);
    else {
      var promises = [];
      for (var index in models) {
        promises.push(new Promise((resolve, reject) => datasource.discoverAndBuildModels(models[index].name, {
          associations: true,
          nameMapper: (type, name) => name
        }, function(innerError, definition) {
          if (innerError) reject(innerError);
          else {
            var name = Object.keys(definition)[0];
            definition[name].setup();
            fs.writeFile(outputPath + '/' + name + '.json', JSON.stringify(definition[name].definition), function(fileError) {
              if (fileError)
                reject(fileError); // This is a callback hell! You may also use promises.
              else {
                resolve(name);
              }
            });
          }
        })));
      }

      modelsFile.then(content => Promise.all(promises).then(values => {
        values.forEach(modelName => content[modelName] = {
          public: true,
          dataSource: datasource
        });
        fs.writeFile(configPath + '/model-config.json', JSON.stringify(content), function(fileError) {
          if (fileError)
            console.log(fileError);
          else
            console.log('Models definitions done');

          process.exit();
        });
      }));
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  initialization();
});