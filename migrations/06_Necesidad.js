exports.up = function(knex) {
    return knex.schema.createTable('Necesidad', (table) => {
        table.increments('idNecesidad').primary();
        table.integer('ponderacion').notNullable(); //int, puede ser string (revisar tipo de dato a ingresar)
        table.enu('estatus', ['Pendiente', 'Validado', 'Rechazado']).defaultTo('Pendiente'); // Se registrara como 'Pendiente' en la base de datos
        table.string('descripcion').notNullable();
        table.string('categoria').notNullable();
        table.integer('CCT').notNullable(); //int, puede ser string (revisar tipo de dato a ingresar)
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Diagnostico, (Revisar tipo de dato a ingresar)
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Necesidad');
};
