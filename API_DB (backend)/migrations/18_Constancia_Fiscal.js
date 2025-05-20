exports.up = function(knex) {
  return knex.schema.createTable('Constancia_Fiscal', (table) => {
    table.increments('idConstanciaFiscal').primary();
    table.string('domicilio').notNullable();
    table.string('regimen').notNullable();
    table.string('razon_social').notNullable();
    table.string('RFC').notNullable();
    table.integer('idPersonaMoral').notNullable(); //idPersonaMoral de la persona moral que recibe el apoyo
    table.foreign('idPersonaMoral').references('idPersonaMoral').inTable('Persona_Moral'); 
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Constancia_Fiscal');
};