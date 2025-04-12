exports.up = function(knex) {
    return knex.schema.createTable('Escuela', (table) => {
        table.string('CCT').primary();
        table.string('nombre').notNullable();
        table.string('modalidad').notNullable(); //Revisar tipo de dato a ingresar
        table.string('nivel_educativo').notNullable();
        table.string('sector_escolar').notNullable(); 
        table.string('sostenimiento').notNullable();
        table.string('zona_escolar').notNullable();
        table.string('calle').notNullable();
        table.string('colonia').notNullable();
        table.string('municipio').notNullable();
        table.string('numero').notNullable();
        table.string('descripcion').notNullable();
        table.string('control_administrativo').notNullable();
        table.integer('numero_estudiantes').notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Escuela');
};
