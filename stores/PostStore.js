const fs = require('fs');

class PostStore {
	constructor(app, db) {
		super();

		this.db = db;
		this.app = app;
	};

	async create(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO posts (
					hid,
					title,
					body,
					user_id,
					cover_url,
					timestamp,
					tags
				) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
				[hid, data.title, data.body, data.user_id,
				 data.cover_url, data.timestamp, data.tags])
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
				await this.db.query(`INSERT INTO posts (
					hid,
					title,
					body,
					user_id,
					cover_url,
					timestamp,
					tags
				) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
				[hid, data.title, data.body, data.user_id,
				 data.cover_url, data.timestamp, data.tags])
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
				var data = await this.db.query(`SELECT * FROM posts WHERE hid = $1`, [hid]);
			} catch(e) {
				return rej(e);
			}
			
			if(data.rows?.[0]) {
				data.rows[0].user = await this.app.stores.users.get(data.rows[0].user_id);
				data.rows[0].short = this.app.stripper(this.app.conv.makeHtml(data.rows[0].body), {
					allowedTags: []}
				).split(" ").slice(0, 50).join(" ")+"...";
				data.rows[0].body = this.app.conv.makeHtml(data.rows[0].body);
				res(data.rows[0]);
			} else res(undefined);
		})
	}

	async getAll() {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM posts`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows && data.rows[0]) {
				var posts = [];
				for(var p of data.rows) {
					p.user = await this.app.stores.users.get(p.user_id);
					p.short = this.app.stripper(this.app.conv.makeHtml(p.body), {allowedTags: []}).split(" ").slice(0, 25).join(" ")+"...";
					p.body = this.app.conv.makeHtml(p.body);
					posts.push(p);
				}

				posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
				res(posts)
			} else res(undefined);
		})
	}

	async getAllRaw() {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM posts ORDER BY timestamp`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows && data.rows[0]) {
				res(data.rows)
			} else res(undefined);
		})
	}

	async getByUser(user) {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM posts WHERE user_id = $1 ORDER BY timestamp`, [user]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows && data.rows[0]) {
				res(data.rows)
			} else res(undefined);
		})
	}

	async update(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`UPDATE posts SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")} WHERE hid = $1`,[hid, ...Object.values(data)]);
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
				await this.db.query(`DELETE FROM posts WHERE hid = $1`, [hid]);
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
				await this.db.query(`DELETE FROM posts`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			res();
		})
	}
}

module.exports = (app, db) => new PostStore(app, db);