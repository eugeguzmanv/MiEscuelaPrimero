exports.up = function(knex) {
  return knex.schema.createTable('Necesidad_tiene_evidencia', (table) => {
    table.increments('idNecesidadEvidencia').primary();
    table.foreign('idNecesidad').references('idNecesidad').inTable('Necesidad'); // Foreign key de la tabla Necesidad
    //table.foreign('idEvidencia').references('idEvidencia').inTable('Evidencia'); // Foreign key de la tabla Evidencia
    table.string('nombre').notNullable();
    table.string('ruta').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Necesidad_tiene_evidencia');
};
