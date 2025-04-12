exports.up = function(knex) {
    return knex.schema.createTable('Actividad', (table) => {
        table.increments('idActividad').primary();
        table.string('nombre').notNullable();
        table.string('tipo').notNullable();
        table.string('estatus').notNullable();
        table.string('fecha_inicio').notNullable();
        table.string('fecha_fin').notNullable();
        table.foreing('idCronograma').references('idCronograma').inTable('Cronograma'); //Foreing key de la tabla Cronograma
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Actividad');
};
