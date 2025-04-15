exports.up = function(knex) {
    return knex.schema.createTable('Apoyo', (table) => {
        table.increments('idApoyo').primary();
        table.string('tipo').notNullable();
        table.string('estatus').notNullable();
        table.string('categoria').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Apoyo');
};
