
exports.up = function(knex) {
    return knex.schema.createTable('Aliado', (table) => {
        table.increments('idAliado').primary();
        table.string('correo_electronico').notNullable();
        table.string('tipo').notNullable();
        table.string('nombre').notNullable();
        table.string('contraseña').notNullable();
        table.string('CURP').notNullable();
        table.string('categoria_apoyo').notNullable(); //Revisar tipo de dato a ingresar
        table.string('institucion').notNullable();
        table.string('calle').notNullable();
        table.string('colonia').notNullable();
        table.string('municipio').notNullable();
        table.integer('numero').notNullable(); //Revisar tipo de dato a ingresar
        table.string('descripcion').notNullable();
        table.enu('estado_validacion', ['pendiente', 'validado', 'rechazado']).defaultTo('pendiente');
        table.text('comentario_admin');
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('Aliado');
};
