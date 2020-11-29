class ContactStore {
	constructor(app, db) {
		this.db = db;
		this.app = app;
	};

	async create(name, url) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO contacts (
					name,
					url
				) VALUES ($1,$2)`,
				[name, url])
			} catch(e) {
				console.log(e);
		 		return rej(e.message);
			}
			
			res(await this.get(name));
		})
	}

	async index(name, url) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO contacts (
					name,
					url
				) VALUES ($1,$2)`,
				[name, url])
			} catch(e) {
				console.log(e);
		 		return rej(e.message);
			}
			
			res();
		})
	}

	async get(name) {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM contacts WHERE name = $1`, [name]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}

			if(data.rows?.[0]) res(data.rows[0]);
			else res(undefined);
		})
	}

	async getAll() {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM contacts`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows?.[0]) res(data.rows);
			else res(undefined);
		})
	}

	async update(name, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`UPDATE contacts SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")} WHERE name = $1`,[name, ...Object.values(data)]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}

			res(await this.get(name));
		})
	}

	async delete(name) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`DELETE FROM contacts WHERE name = $1`, [name]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			res();
		})
	}

	async deleteAll() {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`DELETE FROM contacts`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			res();
		})
	}
}

module.exports = (app, db) => new ContactStore(app, db);