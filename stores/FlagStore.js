const fs = require('fs');

class FlagStore {
	constructor(app, db) {
		this.db = db;
		this.app = app;
	};

	async create(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO flags (
					hid,
					name,
					category
				) VALUES ($1,$2,$3)`,
				[hid, data.name, data.category])
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
				await this.db.query(`INSERT INTO flags (
					hid,
					name,
					category
				) VALUES ($1,$2,$3)`,
				[hid, data.name, data.category])
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
				var fl = await this.getAll();
			} catch(e) {
				return rej(e);
			}
			
			//we have to order the flags
			//to get the correct next/previous ones
			if(Object.keys(fl)[0]) {
				var flags = [];
				Object.keys(fl).forEach(f => {
					fl[f].map(x => flags.push(x));
				})
				var flag = flags.find(x => x.hid.toLowerCase() == hid.toLowerCase());
				if(!flag) res(undefined);
				else {
					var index = flags.indexOf(flag);
					flag.prev = index > 0 ? flags[index - 1].hid : undefined;
					flag.next = index < flags.length - 1 ? flags[index + 1].hid : undefined;

					res(flag);
				}
			} else res(undefined);
		})
	}

	async getRaw(hid) {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM flags WHERE hid = $1`, [hid]);
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
				var data = await this.db.query(`SELECT * FROM flags`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows && data.rows[0]) {
				var flags = {};
				for(var fl of data.rows) {
					var files = fs.readdirSync(__dirname+'/../Images/flags/'+fl.hid);
					fl.images = [];
					files.forEach(f => {
						if(f.endsWith(".png")) fl.images.push(f);
						else {
							fl.desc = fs.readFileSync(`${__dirname}/../Images/flags/${fl.hid}/${f}`);
							fl.desc = this.app.conv.makeHtml(fl.desc.toString());
						}
					})
					if(flags[fl.category]) {
						flags[fl.category].push(fl);
					} else {
						flags[fl.category] = [fl];
					}
				}
				
				res(flags)
			} else res(undefined);
		})
	}

	async getAllRaw() {
		return new Promise(async (res, rej) => {
			try {
				var data = await this.db.query(`SELECT * FROM flags ORDER BY category, id`);
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
				await this.db.query(`UPDATE flags SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")} WHERE hid = $1`,[hid, ...Object.values(data)]);
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
				await this.db.query(`DELETE FROM flags WHERE hid = $1`, [hid]);
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
				await this.db.query(`DELETE FROM flags`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			res();
		})
	}
}

module.exports = (app, db) => new FlagStore(app, db);