exports.up = function(knex) {
    return knex.schema.craeteTable('Aliado_Brinda_Apoyo', (table) => {
        table.increments('idBrinda').primary();
        table.foreing('idAliado').references('idAliado').inTable('Aliado'); //Foreing key de la tabla Aliado
        table.foreing('idApoyo').references('idApoyo').inTable('Apoyo'); //Foreing key de la tabla Apoyo
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Aliado_Brinda_Apoyo');
};
