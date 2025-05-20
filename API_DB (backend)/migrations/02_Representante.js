exports.up = function(knex) {
    return knex.schema.createTable('Representante', (table) => {
        table.increments('idRepresentante').primary();
        table.string('correo_electronico').notNullable();
        table.string('nombre').notNullable();
        table.string('contrasena').notNullable();
        table.string('numero_telefonico').notNullable();
        table.string('CCT').notNullable(); //Revisar tipo de dato a ingresar
        table.foreign('CCT').references('CCT').inTable('Escuela'); //Foreing key de la tabla Escuela, (Revisar tipo de dato a ingresar)
        table.string('rol').notNullable();
        table.integer('anios_experiencia').notNullable();
        table.bool('proximo_a_jubilarse').notNullable(); //Revisar tipo de dato a ingresar
        table.bool('cambio_zona').notNullable(); //Revisar tipo de dato a ingresar
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('Representante');
};