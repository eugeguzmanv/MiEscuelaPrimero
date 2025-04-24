/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // Ya que en el modelo relacional la entidad de Cronograma tiene una relación ternaria con Escuela y Aliado, se crea otra tabla con el id del cronograma, del aliado y de la escuela
    return knex.schema.createTable('Cronograma_asignado', (table) => {
        table.increments('idCronograma_Asignado').primary(); //idCronograma del cronograma que se asigna------ O SE PUEDE DEJAR COMO ID_CRONOGRAMAASIGNADO
        table.string('CCT').notNullable();
        table.integer('idAliado').notNullable();
        table.integer('idCronograma').notNullable();
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela
        table.foreign('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
        table.foreign('idCronograma').references('idCronograma').inTable('Cronograma'); //Foreing key de la tabla Cronograma
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('Cronograma_asignado');
  
};
