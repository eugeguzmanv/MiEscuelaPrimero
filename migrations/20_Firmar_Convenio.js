/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Firmar_Convenio', (table) => {
        table.increments('idFirmar_Convenio').primary(); // id del convenio
        table.string('CCT').notNullable(); // CCT de la escuela que recibe el apoyo
        table.integer('idConvenio').notNullable(); // id del convenio que se firma
        table.foreign('idConvenio').references('idConvenio').inTable('Convenio'); // Foreing key de la tabla Convenio
        table.integer('idAliado').notNullable(); // idAliado del aliado que brinda el apoyo
        table.foreign('CCT').references('CCT').inTable('Escuela'); // Foreing key de la tabla Escuela
        table.foreign('idAliado').references('idAliado').inTable('Aliado'); // Foreing key de la tabla Aliado
        table.date('fecha_firma').nullable().defaultTo(knex.fn.now()); // Fecha en la que se firma el convenio, puede ser nula si no ha sido firmado

    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Firmar_Convenio');
  
};
