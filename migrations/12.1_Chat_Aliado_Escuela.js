/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // Ya que en el modelo relacional la entidad de Chat tiene una relación ternaria con Escuela y Aliado, se crea otra tabla con el id del chat, del aliado y de la escuela
    return knex.schema.createTable('Chat_Aliado_Escuela', (table) => {
        table.primary(['idChat', 'idAliado', 'CCT']); //Primary key de la tabla 
        table.integer('idChat').notNullable();
        table.integer('idAliado').notNullable();
        table.integer('CCT').notNullable();
        table.foreign('idChat').references('idChat').inTable('Chat'); //Foreing key de la tabla Escuela
        table.foreign('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Apoyo
        
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
