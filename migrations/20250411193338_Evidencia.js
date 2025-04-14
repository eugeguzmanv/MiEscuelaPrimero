exports.up = function(knex) {
    return knex.schema.createTable('Evidencia', (table) => {
        table.increments('idEvidencia').primary();
        table.foreign('idApoyo').references('idApoyo').inTable('Apoyo'); //Foreing key de la tabla Apoyo
        table.foreign('idNecesidad').references('idNecesidad').inTable('Necesidad'); //Foreing key de la tabla Necesidad
        table.string('nombre').notNullable();
        table.string('ruta').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Apoyo_tiene_evidencia');
};
