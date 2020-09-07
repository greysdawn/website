module.exports = (app) => {
	app.get('/api/posts', async (req,res)=>{
		var posts = (await app.stores.posts.getAll());
		if(posts == "ERR") return res.send("ERR");
		res.send(posts);
	})

	app.get('/api/posts/:hid',async (req,res)=>{
		var posts = (await app.stores.posts.getByUser(req.params.hid));
		if(posts == "ERR") return res.send("ERR");
		res.send(posts);
	})

	app.post('/api/post', async (req,res)=> {
		res.set("Content-Type","text/html");
		if(!req.verified) return res.status(401).send("UNAUTHORIZED");

		try {
			var post = await app.stores.posts.create(req.body.hid, req.body);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send(post)
	})

	app.get('/api/post/:hid',async (req,res)=>{
		var post = await app.stores.posts.get(req.params.hid);
		if(post) res.send(post);
		else res.status(404).send("NOT FOUND");
	});

	app.get('/api/post/:hid/delete', async (req,res)=>{
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.posts.delete(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send();
	})

	app.delete('/api/post/:hid', async (req,res)=>{
		if(!req.verified) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.posts.delete(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send();
	})

	app.get('/api/post/:hid/oembed',async (req,res)=>{
		var post = (await app.stores.posts.get(req.params.hid));
		if(post) {
			res.send({
				"type": "link",
			    "version": "1.0",
			    "title": post.title+" | Send Us into the Light",
			    "provider_name":"The Grey Skies",
			    "thumbnail_url": "https://greysdawn.com/images/official.png",
			    "thumbnail_width": 32,
			    "thumbnail_height": 32
			});
		} else {
			res.send({
				"type": "link",
			    "version": "1.0",
			    "title": "Not Found | Send Us into the Light",
			    "provider_name":"The Grey Skies",
			    "thumbnail_url": "https://greysdawn.com/images/official.png",
			    "thumbnail_width": 32,
			    "thumbnail_height": 32
			});
		}
	});
}