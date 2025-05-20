exports.up = function(knex) {
    return knex.schema.createTable('Verificar_firma', (table) => {
        table.increments('idVerificar_firma').primary(); // ID de la verificación de firma
        table.integer('idAliado').notNullable(); // ID del aliado al que pertenece la verificación de firma
        table.foreign('idAliado').references('idAliado').inTable('Aliado'); // Foreign key de la tabla Aliado
        table.string('CCT').notNullable(); // CCT del aliado al que pertenece la verificación de firma
        table.foreign('CCT').references('CCT').inTable('Escuela'); // Foreign key de la tabla Aliado
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('Verificar_firma'); // Eliminar la tabla Verificar_firma
};
