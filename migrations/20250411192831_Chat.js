exports.up = function(knex) {
    return knex.schema.createTable('Chat', (table) => {
        table.increments('idChat').primary();
        table.foreing('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela
        table.foreing('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
        table.foreing('idAdmin').references('idAdmin').inTable('Administrador'); //Foreing key de la tabla Administrador
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Chat');
};
