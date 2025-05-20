exports.up = function(knex) {
    return knex.schema.createTable('Convenio', function(table) {
        table.increments('idConvenio').primary();

        table.string('CCT').notNullable();
        table.foreign('CCT').references('CCT').inTable('Escuela');

        table.string('nombre_escuela').notNullable(); 

        table.integer('idAliado').unsigned().notNullable();
        table.foreign('idAliado').references('idAliado').inTable('Aliado');

        table.string('institucion').notNullable();

        table.boolean('firma_aliado').defaultTo(false);
        table.boolean('firma_escuela').defaultTo(false);
        table.boolean('validacion_admin').defaultTo(false);

        table.string('categoria').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Convenio');
};
