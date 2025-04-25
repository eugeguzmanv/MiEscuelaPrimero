exports.up = function(knex) {
    return knex.schema.createTable('Escritura_Publica', (table) => {
        table.increments('idEscrituraPublica').primary(); //idEscrituraPublica de la escritura publica
        table.string('numero_escritura').primary(); //Numero de escritura publica
        table.string('fecha_escritura').notNullable();
        table.string('notario').notNullable();
        table.string('ciudad').notNullable();
        table.integer('idPersonaMoral').notNullable(); //idPersonaMoral del aliado que recibe la escritura publica
        table.foreign('idPersonaMoral').references('idPersonaMoral').inTable('Persona_Moral'); //Foreing key de la tabla Aliado
        table.integer('idAliado').notNullable(); //idAliado del aliado que recibe la escritura publica
        table.foreign('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Escritura_Publica');
};