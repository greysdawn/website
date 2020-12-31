const fs = require('fs')

module.exports = (app) => {
	app.post('/api/flag', app.upload.array('panels',10), async (req,res)=> {
		if(!req.session.user) return res.status(401).send('UNAUTHORIZED');
		
		var flag = await app.stores.flags.get(req.body.hid);
		if(flag) return res.status(400).send({err: "name taken"});

		try {
			fs.mkdirSync(__dirname+"/../Images/flags/"+req.body.hid);
		} catch(e) {
			console.log(e);
			return res.status(500).send({err: "couldn't create folder"});
		}

		req.files.forEach((f) => {
			fs.writeFileSync(`${__dirname}/../Images/flags/${req.body.hid}/${f.originalname}`, f.buffer);
		})

		fs.writeFileSync(`${__dirname}/../Images/flags/${req.body.hid}/description.md`, req.body.desc);

		if(!req.files.find(f => f.originalname == "thumb.png")) {
			var thumb = req.files.find(f => ["simplified.png", "full.png"].includes(f.originalname));
			if(thumb) fs.writeFileSync(`${__dirname}/../Images/flags/${req.body.hid}/thumb.png`, thumb.buffer);
		}

		var success = await app.stores.flags.create(req.body.hid, req.body);

		if(success) res.status(200).send({msg: "saved"});
		else res.status(500).send({err: "couldn't save data"});

	})

	app.get('/api/flags', async (req,res)=> {
		var Flags = await app.stores.flags.getAll();
		res.send(Flags);
	})

	app.get('/api/flag/:hid', async (req,res)=> {
		var flag = await app.stores.flags.get(req.params.hid);
		res.send(flag);
	})
}