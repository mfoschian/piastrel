/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {

	await knex.schema.createTable('persons', function(table) {

		table.increments('id');
		// table.string('id', 64).primary();
		table.string('first_name', 255).index();
		table.string('last_name', 255).index();
		table.string('code', 20).index();
		table.text('note').nullable();

	});

	await knex.schema.createTable('contacts', function(table) {

		table.increments('id');
		table.integer('person_id').notNullable().index();
		table.string('type').notNullable().index();
		table.string('value', 255);

	});

	await knex.schema.createTable('events', function(table) {

		table.increments('id');
		table.string('title').notNullable().index();
		table.string('title_slo');
		table.date('date').index();
		table.boolean('active').defaultTo(true).index();
		table.json('info');
	});

	await knex.schema.createTable('buckets', function(table) {

		table.increments('id');
		table.string('number', 16).notNullable().index();
		table.string('name').notNullable().index();
		table.string('name_slo');
		table.text('address');
		table.text('address_slo');
		table.string('inferred_status', 20).nullable();
	});

	await knex.schema.createTable('convocations', function(table) {

		table.increments('id');
		table.integer('person_id').notNullable().index();
		table.integer('event_id').notNullable().index();
		table.integer('bucket_id').nullable().index();
		table.string('status', 20).nullable();
		table.text('note').nullable();

	});

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
