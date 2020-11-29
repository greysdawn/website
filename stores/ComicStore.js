const fs = require('fs');

class ComicStore {
	constructor(app, db) {
		this.db = db;
		this.app = app;
	};

	async create(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO comics (
					hid,
					name,
					tagline,
					description,
					story
				) VALUES ($1,$2,$3,$4,$5)`,
				[hid, data.name, data.tagline, data.description, data.story])
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
				await this.db.query(`INSERT INTO comics (
					hid,
					name,
					tagline,
					description,
					story
				) VALUES ($1,$2,$3,$4,$5)`,
				[hid, data.name, data.tagline, data.description, data.story])
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
				var cm = await this.getAll();
			} catch(e) {
				return rej(e);
			}
			
			//we have to order the comics
			//to get the correct next/previous ones
			if(cm?.[0]) {
				var comics = [];
				Object.keys(cm).forEach(c => {
					cm[c].map(x => comics.push(x));
				})
				var comic = comics.find(x => x.hid == hid);
				if(!comic) res(undefined);
				else {
					var index = comics.indexOf(comic);
					comic.prev = index > 0 ? comics[index - 1].hid : undefined;
					comic.next = index < comics.length - 1 ? comics[index + 1].hid : undefined;
					res(comic);
				}
			} else res(undefined);
		})
	}

	async getRaw(hid) {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM comics WHERE hid = $1`, [hid]);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows && data.rows[0]) {
				res(data.rows[0])
			} else res(undefined);
		})
	}

	async getAll() {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM comics`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows && data.rows[0]) {
				var comics = {};
				for(var cm of data.rows) {
					cm.images = fs.readdirSync(__dirname+'../Images/comics/'+cm.hid);
					cm.description = this.app.conv.makeHtml(cm.description);
					if(comics[cm.story]) {
						comics[cm.story].push(cm);
					} else {
						comics[cm.story] = [cm];
					}
				}

				res(comics)
			} else res(undefined);
		})
	}

	async getAllRaw() {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM comics ORDER BY story, id`);
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
				await this.db.query(`UPDATE comics SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")} WHERE hid = $1`,[hid, ...Object.values(data)]);
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
				await this.db.query(`DELETE FROM comics WHERE hid = $1`, [hid]);
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
				await this.db.query(`DELETE FROM comics`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			res();
		})
	}
}

module.exports = (app, db) => new ComicStore(app, db);