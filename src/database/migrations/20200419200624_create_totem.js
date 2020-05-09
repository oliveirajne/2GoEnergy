
exports.up = function(knex) {
    return knex.schema.createTable('totem', function(table) {
        table.string('id').primary();
        table.string('latitude').notNullable();
        table.string('longitude').notNullable();
        
    });    
};

exports.down = function(knex) {
    return knex.schema.dropTable('totem');
};
