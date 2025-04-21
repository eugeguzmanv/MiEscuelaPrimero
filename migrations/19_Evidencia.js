exports.up = function(knex) {
    return knex.schema.createTable('Evidencia', (table) => {
        table.increments('idEvidencia').primary();
        /*table.integer('idApoyo').notNullable(); //idApoyo del apoyo que recibe la escuela
        table.foreign('idApoyo').references('idApoyo').inTable('Apoyo'); //Foreing key de la tabla Apoyo
        table.integer('idNecesidad').notNullable(); //idNecesidad de la necesidad que recibe el apoyo
        table.foreign('idNecesidad').references('idNecesidad').inTable('Necesidad'); //Foreing key de la tabla Necesidad
        table.string('nombre').notNullable();
        table.string('ruta').notNullable();*/
    table.text('ruta').notNullable();
    table.text('nombre');
    table.enu('tipo_evidencia', ['imagen', 'documento', 'video']).notNullable();

    // Polimorfismo: el ID de la entidad relacionada (Apoyo o Necesidad o Actividad) para no tener muchas columnas de id
    // NO ES SEGURO SI INCLUIR ID DE ACTIVIDAD
    table.integer('idReferencia').notNullable();

    // Tipo de referencia: Apoyo o Necesidad
    table.enu('tipoReferencia', ['Apoyo', 'Necesidad', 'Actividad']).notNullable();

    // Índice para consultas rápidas
    table.index(['idReferencia', 'tipoReferencia']);
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Evidencia');
};
