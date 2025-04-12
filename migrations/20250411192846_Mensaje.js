exports.up = function(knex) {
    return knex.schema.createTable('Mensaje', (table) => {
        table.increments('idMensaje').primary();
        table.string('contenido').notNullable();
        table.string('fecha_hora').notNullable();
        //table.foreign('idEmisor').references('idEmisor').inTable('Emisor'); //Foreing key de la tabla Administrador
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Mensaje');
};
