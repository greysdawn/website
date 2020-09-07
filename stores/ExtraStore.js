class ExtraStore {
	constructor(app, db) {
		super();

		this.db = db;
		this.app = app;
	};

	async create(key, val) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO extras (
					key,
					val
				) VALUES ($1,$2)`,
				[key, val])
			} catch(e) {
				console.log(e);
		 		return rej(e.message);
			}
			
			res(await this.get(key));
		})
	}

	async index(key, val) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO extras (
					key,
					val
				) VALUES ($1,$2)`,
				[key, val])
			} catch(e) {
				console.log(e);
		 		return rej(e.message);
			}
			
			res();
		})
	}

	async get(key) {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM extras WHERE key = $1`, [key]);
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
				var data = await this.db.query(`SELECT * FROM extras`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows && data.rows[0]) res(data.rows);
			else res(undefined);
		})
	}

	async update(key, val) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`UPDATE extras SET val = $2 WHERE key = $1`,[key, val]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}

			res(await this.get(key));
		})
	}

	async delete(key) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`DELETE FROM extras WHERE key = $1`, [key]);
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
				await this.db.query(`DELETE FROM extras`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			res();
		})
	}
}

module.exports = (app, db) => new ExtraStore(app, db);