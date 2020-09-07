module.exports = (app) => {
	app.get("/api/user",async (req,res)=>{
		res.send(req.cookies.user ? JSON.parse(req.cookies.user) : undefined);
	})

	app.get('/api/users', async (req,res)=>{
		var users = await app.stores.users.getAll();
		if(users == "ERR") return res.send("ERR");
		res.send(users);
	})

	app.post('/api/user', async(req,res)=>{
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.users.create(req.body.hid, req.body);
		} catch(e) {
			return res.status(500).send('ERR');
		}
	})

	app.get('/api/user/:hid', async (req,res)=> {
		try {
			var user = await app.stores.users.get(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		if(user) res.status(404).send('User not found.');
		else res.send(user);
	})

	app.get('/api/user/:hid/delete', async (req,res)=>{
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.users.delete(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send();
	})

	app.delete('/api/user/:hid',async (req,res)=>{
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.users.delete(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send();
	})

	app.post('/api/login', async (req,res)=> {
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');
		
		res.cookie('user', JSON.stringify(req.user), { expires: new Date('01/01/2030'), httpOnly: true });
		res.status(200).send("OK");
	});
}