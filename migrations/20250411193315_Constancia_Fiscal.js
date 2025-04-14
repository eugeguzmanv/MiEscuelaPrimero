exports.up = function(knex) {
  return knex.schema.createTable('Constancia_Fiscal', (table) => {
    table.increments('idConstanciaFiscal').primary();
    table.string('domicilio').notnullable();
    table.string('regimen').notnullable();
    table.string('razon_social').notnullable();
    table.string('RFC').notnullable();
    table.integer('idPersonaMoral').notnullable(); //idPersonaMoral de la persona moral que recibe el apoyo
    table.foreign('idPersonaMoral').references('idPersonaMoral').inTable('Persona_Moral').notnullable(); 
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Constancia_Fiscal');
};