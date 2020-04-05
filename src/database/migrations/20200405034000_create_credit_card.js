
exports.up = function(knex) {
    return knex.schema.createTable('credit_cards', function(table) {
        table.increments();
        table.string('hash').notNullable();
        table.string('brand').notNullable();
        
        table.string('user_id').notNullable();

        table.foreign('user_id').references('id').inTable('users');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('credit_cards');
};