class ProjectStore {
	constructor(app, db) {
		super();

		this.db = db;
		this.app = app;
	};

	async create(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`INSERT INTO projects (
					hid,
					name,
					tag,
					description,
					title,
					about,
					background,
					links,
					releases,
					gallery
				) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
				[hid, data.name, data.tag, data.description, data.title,
				 data.about, data.background, data.links, data.releases,
				 data.gallery])
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
				await this.db.query(`INSERT INTO projects (
					hid,
					name,
					tag,
					description,
					title,
					about,
					background,
					links,
					releases,
					gallery
				) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
				[hid, data.name, data.tag, data.description, data.title,
				 data.about, data.background, data.links, data.releases,
				 data.gallery])
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
				var data = await this.db.query(`SELECT * FROM projects WHERE hid = $1`, [hid]);
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
				var data = await this.db.query(`SELECT * FROM projects`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			if(data.rows?.[0]) res(data.rows);
			else res(undefined);
		})
	}

	async update(hid, data = {}) {
		return new Promise(async (res, rej) => {
			try {
				await this.db.query(`UPDATE projects SET ${Object.keys(data).map((k, i) => k+"=$"+(i+2)).join(",")} WHERE hid = $1`,[hid, ...Object.values(data)]);
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
				await this.db.query(`DELETE FROM projects WHERE hid = $1`, [hid]);
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
				await this.db.query(`DELETE FROM projects`);
			} catch(e) {
				console.log(e);
				return rej(e.message);
			}
			
			res();
		})
	}
}

module.exports = (app, db) => new ProjectStore(app, db);