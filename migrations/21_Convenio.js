/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('Convenio', (table) => {
        table.increments('idConvenio').primary(); // id del convenio
        table.boolean('firmado').defaultTo(false); // Indica si el convenio ha sido firmado o no
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Convenio');
  
};
