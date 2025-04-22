
exports.up = function(knex) {
    return knex.schema.createTable('Aliado', (table) => {
        table.increments('idAliado').primary();
        table.string('correo_electronico').notNullable();
        table.string('nombre').notNullable();
        table.string('contraseña').notNullable();
        table.string('CURP').notNullable();
        table.string('institucion').notNullable();
        table.string('sector').notNullable();
        table.string('calle').notNullable();
        table.string('colonia').notNullable();
        table.string('municipio').notNullable();
        table.integer('numero').notNullable(); //Revisar tipo de dato a ingresar
        table.string('descripcion').notNullable();
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('Aliado');
};
