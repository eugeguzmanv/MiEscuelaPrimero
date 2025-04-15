exports.up = function(knex) {
    return knex.schema.createTable('Diagnostico', (table) => {
        table.increments('idDiagnostico').primary();
        table.string('fecha').notNullable();
        table.string('CCT').notNullable(); //Revisar tipo de dato a ingresar
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela     
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('Diagnostico');
};
