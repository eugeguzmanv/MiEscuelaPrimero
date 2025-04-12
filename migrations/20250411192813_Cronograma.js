exports.up = function(knex) {
    return knex.schema.createTable('Cronograma', (table) => {
        table.increments('idCronograma').primary();
        table.string('fecha_inicio').notNullable();
        table.string('fecha_fin').notNullable();
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela
        table.foreign('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Cronograma');
};
