exports.up = function(knex) {
    return knex.schema.createTable('Necesidad', (table) => {
        table.increments('idNecesidad').primary();
        table.integer('ponderacion').notNullable(); //int, puede ser string (revisar tipo de dato a ingresar)
        table.enu('estatus', ['Pendiente', 'Validado', 'Rechazado']).defaultTo('Pendiente');
        table.string('descripcion').notNullable();
        table.string('categoria').notNullable();
        table.string('CCT').notNullable();
        table.foreign('CCT').references('CCT').inTable('Escuela');
    });
};
exports.down = function(knex) {
    return knex.schema.dropTable('Necesidad');
};
