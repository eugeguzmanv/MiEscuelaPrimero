exports.up = function(knex) {
    return Promise.all([
        knex.schema.alterTable('Necesidad', function(table) {
            table.dropColumn('categoria');
            table.dropColumn('descripcion');
        }),
        knex.schema.alterTable('Apoyo', function(table) {
            table.dropColumn('categoria');
        })
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.alterTable('Necesidad', function(table) {
            table.string('categoria').notNullable();
            table.string('descripcion').notNullable();
        }),
        knex.schema.alterTable('Apoyo', function(table) {
            table.string('categoria').notNullable();
        })
    ]);
};
