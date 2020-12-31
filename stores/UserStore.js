const SHA3 = require('crypto-js/sha3');

class UserStore {
	constructor(app, db) {
		this.db = db;
		this.app = app;
	};

	async create(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO users (
					hid,
					name,
					password,
					salt,
					bio,
					avatar_url
				) VALUES ($1,$2,$3,$4,$5,$6)`,
				[hid, data.name, data.password, data.salt,
				data.bio, data.avatar_url])
			} catch(e) {
				console.log(e);
		 		return rej(e.message);
			}
			
			res(await this.get(hid));
		})
	}

	async index(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO users (
					hid,
					name,
					password,
					salt,
					bio,
					avatar_url
				) VALUES ($1,$2,$3,$4,$5,$6)`,
				[hid, data.name, data.password, data.salt,
				data.bio, data.avatar_url])
			} catch(e) {
				console.log(e);
		 		return rej(e.message);
			}
			
			res();
		})
	}

	async get(hid) {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM users WHERE hid = $1`, [hid]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows?.[0]) {
				delete data.rows[0].password;
				delete data.rows[0].salt;
				res(data.rows[0]);
			} else res(undefined);
		})
	}

	async getAll() {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM users`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows && data.rows[0]) {
				for(var row of data.rows) {
					delete row.password;
					delete row.salt;
				}
				res(data.rows)
			} else res(undefined);
		})
	}

	async update(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`UPDATE users SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")} WHERE hid = $1`,[hid, ...Object.values(data)]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}

			res(await this.get(hid));
		})
	}

	async delete(hid) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`DELETE FROM users WHERE hid = $1`, [hid]);
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
				await this.db.query(`DELETE FROM users`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			res();
		})
	}

	async auth(name, pass) {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM users WHERE name = $1`, [name]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows?.[0] && SHA3(pass + data.rows[0].salt).toString() == data.rows[0].password) {
				delete data.rows[0].password;
				res(data.rows[0]);
			} else res(undefined);
		})
	}
}

module.exports = (app, db) => new UserStore(app, db);