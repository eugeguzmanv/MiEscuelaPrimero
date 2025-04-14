exports.up = function(knex) {
    return knex.schema.createTable('Escuela_Recibe_Apoyo', (table) => {
        table.increments('idSolicitud').primary();
        table.string('CCT').notNullable(); //CCT de la escuela que recibe el apoyo
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela
        table.integer('idApoyo').notNullable(); //idApoyo del apoyo que recibe la escuela
        table.foreign('idApoyo').references('idApoyo').inTable('Apoyo'); //Foreing key de la tabla Apoyo
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Escuela_Recibe_Apoyo');
};
