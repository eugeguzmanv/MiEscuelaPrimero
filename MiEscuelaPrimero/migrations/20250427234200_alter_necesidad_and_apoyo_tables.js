exports.up = function(knex) {
    return Promise.all([
        knex.schema.alterTable('Necesidad', function(table) {
            table.dropColumns('ponderacion', 'status', 'idDiagnostico'); // Remove old columns
            table.string('Categoria').notNullable();
            table.string('Sub_categoria').notNullable();
            table.string('Fecha').notNullable();
            table.string('Descripcion').notNullable();
            table.boolean('Estado_validacion').defaultTo(false);
            table.string('CCT'); // Corrected to string
            table.foreign('CCT').references('CCT').inTable('Escuela');
        }),
        knex.schema.alterTable('Apoyo', function(table) {
            table.dropColumns('tipo', 'estatus'); // Remove old columns
            table.string('Categoria').notNullable();
            table.string('Sub_categoria').notNullable();
            table.string('Fecha').notNullable();
            table.string('Descripcion').notNullable();
            table.boolean('Estado_validacion').defaultTo(false);
            table.integer('idAliado').unsigned();
            table.foreign('idAliado').references('idAliado').inTable('Aliado');
        })
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.alterTable('Necesidad', function(table) {
            table.dropColumns('Categoria', 'Sub_categoria', 'Fecha', 'Descripcion', 'Estado_validacion', 'CCT');
            // If needed, you can recreate the old columns here (optional)
        }),
        knex.schema.alterTable('Apoyo', function(table) {
            table.dropColumns('Categoria', 'Sub_categoria', 'Fecha', 'Descripcion', 'Estado_validacion', 'idAliado');
            // If needed, you can recreate the old columns here (optional)
        })
    ]);
};
