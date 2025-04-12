exports.up = function(knex) {
    return knex.schema.createTable('Escuela_Recibe_Apoyo', (table) => {
        table.increments('idSolicitud').primary();
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela
        table.foreign('idApoyo').references('idApoyo').inTable('Apoyo'); //Foreing key de la tabla Apoyo
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Escuela_Recibe_Apoyo');
};
