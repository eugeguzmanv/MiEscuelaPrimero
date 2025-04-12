exports.up = function(knex) {
  return knex.schema.createTable('Constancia_Fiscal', (table) => {
    table.increments('idConstanciaFiscal').primary();
    table.string('numero_escritura').notnullable();
    table.string('fecha_escritura').notnullable();
    table.string('notario').notnullable();
    table.string('ciudad').notnullable();
    table.foreign('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Constancia_Fiscal');
};