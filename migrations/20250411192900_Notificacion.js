exports.up = function(knex) {
    return knex.schema.createTable('Notificacion', (table) => {
        table.increments('idNotificacion').primary();
        table.string('contenido').notNullable();
        table.foreign('idAliado').references('idAliado').inTable('Aliado');
        table.foreign('CCT').references('CCT').inTable('Escuela');
        table.foreign('idAdmin').references('idAdmin').inTable('Administrador');
        table.dateTime('fecha_hora').defaultTo(knex.fn.now());

        
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Notificacion');
};
