exports.up = function(knex) {
    return knex.schema.createTable('Evidencia', (table) => {
    table.increments('idEvidencia').primary(); // ID de la evidencia
    table.integer('idApoyo').notNullable(); // ID del apoyo al que pertenece la evidencia
    table.foreign('idApoyo').references('idApoyo').inTable('Apoyo'); // Foreign key de la tabla Apoyo
    table.integer('idNecesidad').notNullable(); // ID de la necesidad a la que pertenece la evidencia
    table.foreign('idNecesidad').references('idNecesidad').inTable('Necesidad'); // Foreign key de la tabla Necesidad
    table.string('nombre').notNullable(); // Nombre de la evidencia
    table.string('ruta').notNullable(); // Ruta de la evidencia
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Evidencia');
};
