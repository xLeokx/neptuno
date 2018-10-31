
'use strict';

module.exports = function (Pedidos) {

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
