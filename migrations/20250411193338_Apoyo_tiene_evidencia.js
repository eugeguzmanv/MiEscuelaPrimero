exports.up = function(knex) {
    return knex.schema.createTable('Apoyo_tiene_evidencia', (table) => {
        table.increments('idApoyoEvidencia').primary();
        table.foreign('idApoyo').references('idApoyo').inTable('Apoyo'); //Foreing key de la tabla Apoyo
        //table.increments('idEvidencia'); //Revisar el tipo de dato que entra (es autoincremental)
        table.string('nombre').notNullable();
        table.string('ruta').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Apoyo_tiene_evidencia');
};
