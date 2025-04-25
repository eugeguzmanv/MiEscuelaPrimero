exports.up = function(knex) {
    return knex.schema.createTable('Apoyo', (table) => {
        table.increments('idApoyo').primary();
        table.string('tipo').notNullable();
        table.enu('estatus', ['Pendiente', 'Validado', 'Rechazado']).defaultTo('Pendiente');
        table.string('categoria').notNullable();
        table.text('descripcion').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Apoyo');
};
