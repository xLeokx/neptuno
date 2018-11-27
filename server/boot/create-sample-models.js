module.exports = function (app) {
  //data sources

  if(process.env.AUTOMIGRATE == 'true'){

    var mysqlDs = app.dataSources.mysqlDs;
    var db = app.dataSources.db;
  
  
    mysqlDs.automigrate('Devoluciones', function (err) {
      if (err) return cb(err);
    });
  
    //todos los modelos asociados a db , Eso es lo que significa NULL en este caso
  
    db.automigrate(null, function (err) {
      if (err) return cb(err);
    });
  
    //actualizamos la tabla clientes para añadir campos a la tabla 
  
    mysqlDs.autoupdate('Clientes', function (err) {
      if (err) return cb(err);
    });



    mysqlDs.automigrate('Comentarios', function (err) {
      if (err) return cb(err);
    });


    mysqlDs.automigrate('Comentarios', function (err) {
      if (err) return cb(err);
    });

  };
  



  //create all models
};