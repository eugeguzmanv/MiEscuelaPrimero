exports.up = function(knex) {
    return knex.schema.createTable('Diagnostico', (table) => {
        table.increments('idDiagnostico').primary();
        table.timestamp('fecha').defaultTo(knex.fn.now());
        table.string('CCT').notNullable(); //Revisar tipo de dato a ingresar
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela 
        table.enu('estado', ['activo', 'inactivo']).defaultTo('activo'); // Para poder registrar la necesidad en el diagnóstico y que se cree de forma automática cuando quiera ingresar
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('Diagnostico');
};
