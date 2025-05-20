exports.up = function(knex) {
    return knex.schema.createTable('Chat', (table) => {
        table.increments('idChat').primary();
        //table.string('CCT').notNullable(); //CCT de la escuela que recibe el apoyo
        //table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela
        //table.foreign('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
        table.integer('idAdmin').notNullable(); //idAdmin del administrador que brinda el apoyo
        table.foreign('idAdmin').references('idAdmin').inTable('Administrador'); //Foreing key de la tabla Administrador
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Chat');
};
