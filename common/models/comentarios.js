'use strict';

module.exports = function(Comentarios) {

    Comentarios.misComentarios = function(ctx, callback) {
    var coments;
    var idUsuario = ctx.req.accessToken.userId;
            
            Comentarios.find({
                where: {
                    clientesId: idUsuario
                },
            },callback);
            
            /*function(err, coments){
                callback(null, coments);
            });*/
    };


    Comentarios.beforeRemote('create', function (ctx, comentario, next) {
        ctx.args.data.createdAt = Date.now();
        next();
    });


    Comentarios.beforeRemote('create', function(ctx, instancia, next){
        var Pedidos = Comentarios.app.models.Pedidos;
        var idUsuario = ctx.req.accessToken.userId;
        Pedidos.find({where: {
                    IdCliente: idUsuario},
                    include : {
                        relation : 'detallesPedidos',
                        scope: { 
                            where : { IdProducto : ctx.args.data.productosId}
                            }

                    }
            },function(err,pedidos){
                console.info(pedidos);
                if(algunPedidoContieneElProducto(pedidos)){
                      next();

                }else{
                      next(new Error('Compralo cooño'));

                }

            });
           
    });

    var algunPedidoContieneElProducto = function(pedidos){
        var existe = false;
        pedidos.forEach(function(pedido){
            let estepedido=pedido.toJSON();
            if(estepedido.detallesPedidos.length > 0){
                existe=true;
                }
        });
        return existe;

    }








};
