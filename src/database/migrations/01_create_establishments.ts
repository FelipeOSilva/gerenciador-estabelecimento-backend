import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('establishments', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.string('latitude').notNullable();
    table.string('longitude').notNullable();

    table.integer('user_id').notNullable().references('id').inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('establishments');
}
