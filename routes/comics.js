const fs = require('fs')

module.exports = (app) => {
	app.post('/api/comic', app.upload.array('panels',10), async (req,res)=> {
		if(!req.session.user) return res.status(401).send('UNAUTHORIZED');
		
		var comic = await app.stores.comics.getRaw(req.body.hid);
		if(comic) return res.status(400).send({err: "hid taken"});
		console.log(req.files)

		try {
			fs.mkdirSync(__dirname+"/../Images/comics/"+req.body.hid);
		} catch(e) {
			console.log(e);
			return res.status(500).send({err: "couldn't create folder"});
		}

		req.files.forEach((f) => {
			fs.writeFileSync(`${__dirname}/../Images/comics/${req.body.hid}/${f.originalname}`, f.buffer);
		})

		var success = await app.stores.comics.create(req.body.hid, req.body);

		if(success) res.status(200).send({msg: "saved"});
		else res.status(500).send({err: "couldn't save data"});

	})

	app.get('/api/comics', async (req,res)=> {
		var comics = await app.stores.comics.getAll();
		res.send(comics);
	})

	app.get('/api/comic/:hid', async (req,res)=> {
		var comic = await app.stores.comics.get(req.params.hid);
		res.send(comic);
	})
}