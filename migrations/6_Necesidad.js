exports.up = function(knex) {
    return knex.schema.createTable('Necesidad', (table) => {
        table.increments('idNecesidad').primary();
        table.integer('ponderacion').notNullable(); //int, puede ser string (revisar tipo de dato a ingresar)
        table.string('status').notNullable();
        table.string('descripcion').notNullable();
        table.string('categoria').notNullable();
        table.integer('idDiagnostico').notNullable(); //int, puede ser string (revisar tipo de dato a ingresar)
        table.foreign('idDiagnostico').references('idDiagnostico').inTable('Diagnostico'); //Foreing key de la tabla Diagnostico, (Revisar tipo de dato a ingresar)
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Necesidad');
};
