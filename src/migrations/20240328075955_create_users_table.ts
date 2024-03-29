import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('fname').notNullable();
        table.string('lname').notNullable();
        table.string('number').notNullable();
        table.boolean('active').notNullable().defaultTo(0);
        table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
        table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}

