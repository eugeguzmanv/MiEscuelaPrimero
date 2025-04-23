/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('Verificar_firma', (table) => {
        table.boolean('firmas').defaultTo(false); // Agregar el campo 'firmas' con valor por defecto false
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('Verificar_firma', (table) => {
        table.dropColumn('firmas'); // Eliminar el campo 'firmas'
    });
};
