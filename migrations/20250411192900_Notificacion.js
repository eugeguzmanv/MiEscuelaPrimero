exports.up = function(knex) {
    return knex.schema.createTable('Notificacion', (table) => {
        table.increments('idNotificacion').primary();
        table.string('contenido').notNullable();
        //Aqui debe ir el foreing key de "idUsuarioDestino" que hace referencia a alguna tabla
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Notificacion');
};
