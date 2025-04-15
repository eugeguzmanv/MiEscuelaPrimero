exports.up = function(knex) {
    return knex.schema.createTable('Persona_Moral', (table) => {
        table.increments('idPersonaMoral').primary();
        table.string('giro').notNullable(); //Revisar el tipo de dato que se va a ingresar
        table.string('proposito').notNullable();
        table.string('nombre_organizacion').notNullable();
        table.string('pagina_web');
        table.integer('idAliado').notNullable(); //idAliado del aliado que brinda el apoyo
        table.foreign('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado, (Revisar tipo de dato a ingresar)
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Persona_Moral');
};
