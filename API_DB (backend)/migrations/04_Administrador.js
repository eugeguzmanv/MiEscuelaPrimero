exports.up = function(knex) {
    return knex.schema.createTable('Administrador', (table) => {
        table.increments('idAdmin').primary();
        table.string('correo_electronico').notNullable();
        table.string('nombre').notNullable();
        table.string('contrasena').notNullable();
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('Administrador');
};
