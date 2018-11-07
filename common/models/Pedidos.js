
'use strict';

module.exports = function (Pedidos) {



    Pedidos.beforeRemote('create', function (context, pedido, next) {
        context.args.data.FechaPedido = Date.now();
        context.args.data.IdCliente = context.req.accessToken.userId;
        next();
    });



    Pedidos.beforeRemote('prototype.devolver',function(ctx, pedido, next) {
        //CTX INSTANCE  tiene valor de lo que nosotros enviamos en /devolver
        pedido=ctx.instance;
        //la instancia relacionada con detalles de pedidos
        pedido.detallesPedidos({
            //buscamos el id del producto para ver si existe y lo guardamos en filasdetalles
            where:{IdProducto: ctx.args.IdProducto}
        },function(err, filasDetalles){
            if(err) next(err);
            //Si no existe o no encruentra el ID saldra un error
            if (filasDetalles.length == 0){
                next(new Error ('El Producto no esta en ese Pedido'));
            }else{
                //Si no sale error supuestamente EXISTE la ID del produto , asiqu creara una devolucion
                next();
            }
            //console log del contenido 
            console.log(filasDetalles)
            });
        });



        Pedidos.beforeRemote('prototype.devolver',function(ctx, pedido, next) {
       
        pedido=ctx.instance;
       
        pedido.detallesPedidos({
            //buscamos la cantidad filasdetalles
            where:{IdProducto: ctx.args.IdProducto}
            },function(err, filasDetalles){
                if(err) next(err);
                if (ctx.args.Cantidad > filasDetalles[0].Cantidad){
                    next(new Error ('Demasiadas Unidades a devolver, tus unidades son'+filasDetalles[0].Cantidad));
                }else{
                    next();
                }
                console.log(filasDetalles[0].Cantidad)
            });
        });




    Pedidos.prototype.devolver = function (IdProducto, Cantidad, callback) {
        var pedido = this;
        //ese objeto DATA  tiene el valor de los datos enviados .
        var data = {
            //primer argumento el de la tabla
            productosId: IdProducto,
            Cantidad: Cantidad
        }
        pedido.devoluciones.create(data,
            function (err, devolucion) {
                callback(err, devolucion);
            });
    };


};
