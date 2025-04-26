exports.up = function(knex) {
    return knex.schema.createTable('Cronograma', (table) => {
        table.increments('idCronograma').primary();
        table.string('fecha_inicio').notNullable();
        table.string('fecha_fin').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Cronograma');
};
