exports.up = function(knex) {
    return knex.schema.createTable('Aliado_Apoya_Escuela', (table) => {
        table.increments('idEscuelaAliado').primary();
        table.string('CCT').notNullable(); //CCT de la escuela que recibe el apoyo
        table.foreing('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela
        table.integer('idAliado').notNullable(); //idAliado del aliado que brinda el apoyo
        table.foreing('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('Aliado_Apoya_Escuela');
};