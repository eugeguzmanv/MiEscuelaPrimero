exports.up = function(knex) {
    return knex.schema.createTable('Actividad', (table) => {
        table.increments('idActividad').primary();
        table.string('nombre').notNullable();
        table.string('tipo').notNullable();
        table.string('estatus').notNullable();
        table.string('fecha_inicio').notNullable();
        table.string('fecha_fin').notNullable();
        table.integer('idCronograma').notNullable(); //idCronograma del cronograma al que pertenece la actividad
        table.foreign('idCronograma').references('idCronograma').inTable('Cronograma'); //Foreing key de la tabla Cronograma
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Actividad');
};
