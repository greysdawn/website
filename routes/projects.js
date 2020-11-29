module.exports = (app) => {
	app.get('/api/projects', async (req,res)=> {
		var projects = await app.stores.projects.getAll();
		if(!projects?.[0]) return res.send([]);

		for(var i = 0; i < projects.length; i++) if(projects[i].releases) projects[i].links[projects[i].links.length] = {label: "RELEASES", buttons: projects[i].releases};
		res.send(projects);
	})

	app.get('/api/project/:id', async (req,res)=> {
		var proj = await app.stores.projects.get(req.params.id);
		if(proj) res.send(proj);
		else res.status(404).send('NOT FOUND');
	})

	app.post('/api/project', async (req,res)=> {
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');

		try {
			var project = await app.stores.projects.create(req.body);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send(project);
	})

	app.get('/api/project/:hid/delete', async (req,res)=> {
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.projects.delete(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send();
	})

	app.delete('/api/project/:hid', async (req,res)=> {
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.projects.delete(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send();
	})
}