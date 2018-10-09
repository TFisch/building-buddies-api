exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('buildings', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('address');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.integer('building_id').unsigned();
      table.foreign('building_id');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('interests', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('userInterests', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id');
      table.integer('interest_id').unsigned();
      table.foreign('interest_id');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('buildings'),
    knex.schema.dropTable('users'),
    knex.schema.dropTable('interests'),
    knex.schema.dropTable('userInterests'),
  ]);
};
