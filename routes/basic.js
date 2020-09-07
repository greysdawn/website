module.exports = (app) => {
	app.get('/',(req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		index = index.replace('$TITLE','Send Us into the Light');
		index = index.replace('$DESC','Home of the Grey Skies');
		index = index.replace('$TWITDESC','Home of the Grey Skies');
		index = index.replace('$TWITTITLE','Send Us into the Light');
		index = index.replace('$OGTITLE','Send Us into the Light');
		index = index.replace('$OGDESC','Home of the Grey Skies');
		index = index.replace('$OEMBED','oembed.json');
		res.send(index);
	});

	app.get('/contact',(req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		index = index.replace('$TITLE','Contact | Send Us into the Light');
		index = index.replace('$DESC','Home of the Grey Skies');
		index = index.replace('$TWITDESC','Home of the Grey Skies');
		index = index.replace('$TWITTITLE','Contact | Send Us into the Light');
		index = index.replace('$OGTITLE','Contact | Send Us into the Light');
		index = index.replace('$OGDESC','Home of the Grey Skies');
		index = index.replace('$OEMBED','oembed.json');
		res.send(index);
	});

	app.get('/system',(req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		index = index.replace('$TITLE','System | Send Us into the Light');
		index = index.replace('$DESC','System of the Grey Skies');
		index = index.replace('$TWITDESC','System of the Grey Skies');
		index = index.replace('$TWITTITLE','System | Send Us into the Light');
		index = index.replace('$OGTITLE','System | Send Us into the Light');
		index = index.replace('$OGDESC','System of the Grey Skies');
		index = index.replace('$OEMBED','oembed.json');
		res.send(index);
	});

	app.get('/blog',(req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		index = index.replace('$TITLE','Blog | Send Us into the Light');
		index = index.replace('$DESC','Blog of the Grey Skies');
		index = index.replace('$TWITDESC','Blog of the Grey Skies');
		index = index.replace('$TWITTITLE','Blog | Send Us into the Light');
		index = index.replace('$OGTITLE','Blog | Send Us into the Light');
		index = index.replace('$OGDESC','Blog of the Grey Skies');
		index = index.replace('$OEMBED','oembed.json');
		res.send(index);
	});

	app.get('/blog/post/:hid',async (req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		var post = await app.stores.posts.get(req.params.hid);
		if(post) {
			index = index.replace('$TITLE', post.title + ' | Send Us into the Light');
			index = index.replace('$DESC',post.short);
			index = index.replace('$TWITDESC',post.short);
			index = index.replace('$TWITTITLE',post.title+' | Send Us into the Light');
			index = index.replace('$OGTITLE',post.title+' | Send Us into the Light');
			index = index.replace('$OGDESC',post.short);
			index = index.replace('$OEMBED','api/post/'+post.id+"/oembed");
			res.send(index);
		} else {
			index = index.replace('$TITLE', '404 | Send Us into the Light');
			index = index.replace('$DESC','Post not found');
			index = index.replace('$TWITDESC','Post not found');
			index = index.replace('$TWITTITLE','404 | Send Us into the Light');
			index = index.replace('$OGTITLE','404 | Send Us into the Light');
			index = index.replace('$OGDESC','Post not found');
			index = index.replace('$OEMBED','oembed.json');
			res.send(index);
		}
	});

	// app.get('/project/:hid', async (req,res)=>{
	// 	var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
	// 	var proj = await app.stores.projects.get(req.params.hid);
	// 	if(proj) {
	// 		index = index.replace('$TITLE', proj.name+' | Send Us into the Light');
	// 		index = index.replace('$DESC', 'Home of the Grey Skies');
	// 		index = index.replace('$TWITDESC', 'Home of the Grey Skies');
	// 		index = index.replace('$TWITTITLE', proj.name+' | Send Us into the Light');
	// 		index = index.replace('$OGTITLE', proj.name+' | Send Us into the Light');
	// 		index = index.replace('$OGDESC', 'Home of the Grey Skies');
	// 		index = index.replace('$OEMBED', 'oembed.json');
	// 		res.send(index);
	// 	} else {
	// 		index = index.replace('$TITLE', '404 | Send Us into the Light');
	// 		index = index.replace('$DESC', 'Project not found');
	// 		index = index.replace('$TWITDESC', 'Project not found');
	// 		index = index.replace('$TWITTITLE', '404 | Send Us into the Light');
	// 		index = index.replace('$OGTITLE', '404 | Send Us into the Light');
	// 		index = index.replace('$OGDESC', 'Project not found');
	// 		index = index.replace('$OEMBED', 'oembed.json');
	// 		res.send(index);
	// 	}
	// });

	app.get('/comics', async (req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		index = index.replace('$TITLE', 'Comics | Send Us into the Light');
		index = index.replace('$DESC', 'Home of the Grey Skies');
		index = index.replace('$TWITDESC', 'Home of the Grey Skies');
		index = index.replace('$TWITTITLE', 'Comics | Send Us into the Light');
		index = index.replace('$OGTITLE', 'Comics | Send Us into the Light');
		index = index.replace('$OGDESC', 'Home of the Grey Skies');
		index = index.replace('$OEMBED', 'oembed.json');
		res.send(index);
	});

	app.get('/comics/:hid', async (req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		var comic = await app.stores.comics.get(req.params.hid);
		if(comic) {
			index = index.replace('$TITLE', comic.name+' | Send Us into the Light');
			index = index.replace('$DESC', 'Home of the Grey Skies');
			index = index.replace('$TWITDESC', 'Home of the Grey Skies');
			index = index.replace('$TWITTITLE', comic.name+' | Send Us into the Light');
			index = index.replace('$OGTITLE', comic.name+' | Send Us into the Light');
			index = index.replace('$OGDESC', 'Home of the Grey Skies');
			index = index.replace('$OEMBED', 'oembed.json');
			res.send(index);
		} else {
			index = index.replace('$TITLE', 'Comic | Send Us into the Light');
			index = index.replace('$DESC', 'Project not found');
			index = index.replace('$TWITDESC', 'Comic not found');
			index = index.replace('$TWITTITLE', '404 | Send Us into the Light');
			index = index.replace('$OGTITLE', '404 | Send Us into the Light');
			index = index.replace('$OGDESC', 'Comic not found');
			index = index.replace('$OEMBED', 'oembed.json');
			res.send(index);
		}
	});

	app.get('/flags', async (req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		index = index.replace('$TITLE', 'Flags | Send Us into the Light');
		index = index.replace('$DESC', 'Home of the Grey Skies');
		index = index.replace('$TWITDESC', 'Home of the Grey Skies');
		index = index.replace('$TWITTITLE', 'Flags | Send Us into the Light');
		index = index.replace('$OGTITLE', 'Flags | Send Us into the Light');
		index = index.replace('$OGDESC', 'Home of the Grey Skies');
		index = index.replace('$OEMBED', 'oembed.json');
		res.send(index);
	});

	app.get('/flags/:hid', async (req,res)=>{
		var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
		var flag = await app.stores.flags.get(req.params.hid);
		if(flag) {
			index = index.replace('$TITLE', flag.name+' Flag | Send Us into the Light');
			index = index.replace('$DESC', 'Home of the Grey Skies');
			index = index.replace('$TWITDESC', 'Home of the Grey Skies');
			index = index.replace('$TWITTITLE', flag.name+' Flag | Send Us into the Light');
			index = index.replace('$OGTITLE', flag.name+' Flag | Send Us into the Light');
			index = index.replace('$OGDESC', 'Home of the Grey Skies');
			index = index.replace('$OEMBED', 'oembed.json');
			res.send(index);
		} else {
			index = index.replace('$TITLE', '404 | Send Us into the Light');
			index = index.replace('$DESC', 'Flag not found');
			index = index.replace('$TWITDESC', 'Flag not found');
			index = index.replace('$TWITTITLE', '404 | Send Us into the Light');
			index = index.replace('$OGTITLE', '404 | Send Us into the Light');
			index = index.replace('$OGDESC', 'Flag not found');
			index = index.replace('$OEMBED', 'oembed.json');
			res.send(index);
		}
	});
}