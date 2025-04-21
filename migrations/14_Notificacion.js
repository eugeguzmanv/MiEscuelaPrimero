exports.up = function(knex) {
        /*table.increments('idNotificacion').primary();
        table.string('contenido').notNullable();
        table.integer('idAliado').notNullable(); //idAliado del aliado que recibe la notificacion
        table.foreign('idAliado').references('idAliado').inTable('Aliado');
        table.string('CCT').notNullable(); //CCT de la escuela que recibe la notificacion
        table.foreign('CCT').references('CCT').inTable('Escuela');
        table.integer('idAdmin').notNullable(); //idAdmin del administrador que envia la notificacion
        table.foreign('idAdmin').references('idAdmin').inTable('Administrador');
        table.dateTime('fecha_hora').defaultTo(knex.fn.now());*/
        return knex.schema.createTable('Notificacion', function(table) {
            table.increments('idNotificacion').primary(); // ID autoincrementable
        
            table.text('contenido').notNullable();
            table.timestamp('fecha_Hora').defaultTo(knex.fn.now()); //Fecha y hora para que se generen de forma automática
            //table.boolean('leida').defaultTo(false);
        
            // Esta es la clave polimórfica (actor destinatario)
            table.integer('idDestino').notNullable();
            table.enu('rolDestino', ['Aliado', 'Escuela', 'Administrador']).notNullable();
        
            // Índice para búsquedas rápidas por actor
            table.index(['idDestino', 'rolDestino']);
        

        
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Notificacion');
};
