exports.up = function(knex) {
    return knex.schema.createTable('Mensaje', (table) => {
        table.increments('idMensaje').primary();
        table.string('contenido').notNullable();
        table.timestamp('fecha_hora').defaultTo(knex.fn.now()); // Fecha/hora del mensaje
        table.integer('idChat').notNullable(); //idChat del chat al que pertenece el mensaje
        table.foreign('idChat').references('idChat').inTable('Chat'); //Foreing key de la tabla Chat
        table.integer('idRemitente').notNullable(); //idAliado del remitente del mensaje
        table.string('remitente').notNullable(); // Nombre del emisor, registrado al enviar el mensaje
        table.string('rolRemitente').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('Mensaje');
};
