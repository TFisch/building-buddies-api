exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('userInterests'), knex.schema.createTable('user_interests', (table) => {
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
    knex.schema.createTable('userInterests', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned();
      table.foreign('user_id');
      table.integer('interest_id').unsigned();
      table.foreign('interest_id');
      table.timestamps(true, true);
    }),
    knex.schema.dropTable('user_interests'),
  ]);
};
