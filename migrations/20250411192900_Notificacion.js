exports.up = function(knex) {
    return knex.schema.createTable('Notificacion', (table) => {
        table.increments('idNotificacion').primary();
        table.string('contenido').notNullable();
        table.integer('idAliado').notNullable(); //idAliado del aliado que recibe la notificacion
        table.foreign('idAliado').references('idAliado').inTable('Aliado');
        table.string('CCT').notNullable(); //CCT de la escuela que recibe la notificacion
        table.foreign('CCT').references('CCT').inTable('Escuela');
        table.integer('idAdmin').notNullable(); //idAdmin del administrador que envia la notificacion
        table.foreign('idAdmin').references('idAdmin').inTable('Administrador');
        table.dateTime('fecha_hora').defaultTo(knex.fn.now());

        
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Notificacion');
};
