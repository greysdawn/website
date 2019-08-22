/*TODO

	- Admin panel
	- Subscriber emails

*/

const express	= require('express'); 
const fetch		= require('node-fetch');
const fs 		= require('fs');
const path		= require('path');
const dblite	= require('dblite');
const showdown	= require('showdown');
const cookparse	= require('cookie-parser')
const stripper	= require('sanitize-html');

require('dotenv').config();

const conv	= new showdown.Converter();

const db	= dblite('website_data.sqlite','-header');

const app	= express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookparse());

app.use(userAuth);

const chars = process.env.CHARACTERS.split("");

//FUNCTIONS

function genCode(table, num) {
	var codestring="";
	var codenum=0;
	num = num || 8;
	while (codenum<num){
		codestring=codestring+table[Math.floor(Math.random() * (table.length))];
		codenum=codenum+1;
	}
	return codestring;
}

//AUTH
function userAuth(req, res, next) {
	var user = (req.cookies.user ? JSON.parse(req.cookies.user) :
								   {username: req.body.name, pass: req.body.pass});
	db.query(`SELECT * FROM users WHERE name=? AND password=?`,[user.username, user.pass],(err,rows)=>{
		if(err) {
			console.log(err);
			req.verified = false;
		}
		if(rows[0]) {
			req.verified = true;
			req.user = rows[0];
		} else {
			req.verified = false;
		}
		next()
	})
}

//POSTS
async function getPosts() {
	return new Promise((res,rej)=>{
		db.query(`SELECT * FROM posts`,async (err, rows)=>{
			if(err) {
				console.log(err);
				rej("ERR");
			}
			var posts = [];
			await Promise.all(rows.map(async (p) => {
				p.user = await getUser(p.user_id);
				p.short = stripper( conv.makeHtml(p.body),{allowedTags: []} ).split(" ").slice(0, 50).join(" ")+"...";
				p.body = conv.makeHtml(p.body);
				posts.push(p);
				return new Promise(res2 => {
					setTimeout(()=>res2(100),100)
				})
			})).then(()=>{
				res(posts.sort((a,b)=>{
					return new Date(b.timestamp) - new Date(a.timestamp);
				}) || "ERR");
			})
			
		});
	})
}

async function createPost(data) {
	return new Promise((res,rej)=>{
		var code = genCode(chars);
		var date = new Date();
		db.query(`INSERT INTO posts VALUES (?,?,?,?,?,?,?)`,[code, data.title, data.body, data.id, data.cover_url, date.toISOString(), data.tags],(err,rows)=>{
			if(err) {
				console.log(err);
				res(undefined)
			}
			res({id: code});
		})
	})
}

async function getPost(id) {
	return new Promise((res,rej)=>{
		db.query(`SELECT * FROM posts WHERE id=?`,[id],async (err, rows)=>{
			if(err) {
				console.log(err);
				rej("ERR");
			}
			var p = rows[0];
			p.user = await getUser(p.user_id);
			p.short = stripper( conv.makeHtml(p.body),{allowedTags: []} ).split(" ").slice(0, 50).join(" ")+"...";
			p.body = conv.makeHtml(p.body);
			res((p || "ERR"));
		});
	})
}

async function getPostsByUser(id) {
	return new Promise((res,rej)=>{
		db.query(`SELECT * FROM posts WHERE user_id=?`,[id],(err, rows)=>{
			if(err) {
				console.log(err);
				rej("ERR");
			}
			res(rows || "ERR");
		});
	})
}

async function deletePost(id) {
	return new Promise((res,rej)=>{
		db.query(`DELETE FROM posts WHERE id=?`,[id],(err,rows)=>{
			if(err) {
				console.log(err);
				res(false)
			} else {
				res(true)
			}
		})
	})
}


//USERS
async function getUsers() {
	return new Promise((res,rej)=>{
		db.query(`SELECT * FROM users`,(err, rows)=>{
			if(err) {
				console.log(err);
				rej("ERR");
			}
			res(rows.map(m => {
				return {id: m.id, name: m.name, bio: m.bio, avatar_url: m.avatar_url}
			}) || "ERR");
		});
	})
}

async function createUser(data) {
	return new Promise((res,rej)=>{
		db.query(`INSERT INTO users VALUES (?,?,?,?,?)`,[genCode(chars), data.name, data.pass, data.bio, data.avatar_url || "https://cdn.discordapp.com/attachments/481322557925228544/568151546773110784/officialflag.png"],(err,rows)=>{
			if(err) {
				console.log(err);
				res(false);
			}
			res(true);
		})
	})
}

async function getUser(id) {
	return new Promise((res,rej)=>{
		db.query(`SELECT * FROM users WHERE id=?`,[id],(err, rows)=>{
			if(err) {
				console.log(err);
				rej("ERR");
			}
			res({id: rows[0].id, name: rows[0].name, bio: rows[0].bio, avatar_url: rows[0].avatar_url} || undefined);
		});
	})
}

async function deleteUser(id) {
	return new Promise((res,rej)=>{
		db.query(`DELETE FROM users WHERE id=?`,[id],(err,rows)=>{
			if(err) {
				console.log(err);
				res(false)
			} else {
				if(rows.affectedRows > 0) {
					res(true)
				} else {
					res(false)
				}
			}
		})
	})
}

//PROJECTS
async function getProjects() {
	return new Promise(res => {
		db.query(`SELECT * FROM projects`,{
			id: String,
			name: String,
			tag: String,
			description: String,
			title: JSON.parse,
			about: String,
			github: String,
			links: JSON.parse,
			release_names: JSON.parse,
			gallery: JSON.parse
		},(err,rows)=> {
			if(err) {
				console.log(err);
				res(undefined);
			} else {
				res(rows);
			}
		})
	})
}

async function getProject(id) {
	return new Promise(res => {
		db.query(`SELECT * FROM projects WHERE id=?`,[id],(err,rows)=> {
			if(err) {
				console.log(err);
				res(undefined);
			} else {
				res(rows[0]);
			}
		})
	})
}

async function createProject(data) {
	return new Promise(res => {
		db.query(`INSERT INTO projects VALUES (?,?,?,?,?,?,?,?,?,?)`,[data.id, data.name, data.tag, data.description,
															  data.title, data.about, data.github, data.links,
															  data.release_names, data.gallery],
		(err, rows)=> {
			if(err) {
				console.log(err);
				res(false);
			} else {
				res(true);
			}
		})
	})
}

async function deleteProject(id) {
	return new Promise(res => {
		db.query(`DELETE FROM projects WHERE id=?`,[id], (err,rows)=> {
			if(err) {
				console.log(err);
				res(false);
			} else {
				res(true);
			}
		})
	})
}

//SYSTEM

async function getSysID() {
	return new Promise(res => {
		db.query(`SELECT * FROM extra WHERE key='sysid'`,(err, rows)=> {
			if(err) {
				console.log(err);
				res('kndhm');
			} else {
				res(rows[0].val);
			}
		})
	})
}

async function updateSysID(id) {
	return new Promise(res => {
		db.query(`UPDATE extra SET val=? WHERE key='sysid'`,[id],(err, rows)=> {
			if(err) {
				console.log(err);
				res(false);
			} else {
				res(true);
			}
		})
	})
}

async function getContacts() {
	return new Promise(res => {
		db.query(`SELECT * FROM contacts`,(err, rows)=> {
			if(err) {
				console.log(err);
				res(undefined);
			} else {
				res(rows);
			}
		})
	})
}

//ROUTES

//NORMAL ROUTES
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

app.get('/blog/post/:id',async (req,res)=>{
	var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
	var post = await getPost(req.params.id);
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

app.get('/project/:id', async (req,res)=>{
	var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
	var proj = await getProject(req.params.id);
	if(proj) {
		index = index.replace('$TITLE', proj.name+' | Send Us into the Light');
		index = index.replace('$DESC', 'Home of the Grey Skies');
		index = index.replace('$TWITDESC', 'Home of the Grey Skies');
		index = index.replace('$TWITTITLE', proj.name+' | Send Us into the Light');
		index = index.replace('$OGTITLE', proj.name+' | Send Us into the Light');
		index = index.replace('$OGDESC', 'Home of the Grey Skies');
		index = index.replace('$OEMBED', 'oembed.json');
		res.send(index);
	} else {
		index = index.replace('$TITLE', '404 | Send Us into the Light');
		index = index.replace('$DESC', 'Project not found');
		index = index.replace('$TWITDESC', 'Project not found');
		index = index.replace('$TWITTITLE', '404 | Send Us into the Light');
		index = index.replace('$OGTITLE', '404 | Send Us into the Light');
		index = index.replace('$OGDESC', 'Project not found');
		index = index.replace('$OEMBED', 'oembed.json');
		res.send(index);
	}
});


//API ROUTES

//POSTS
app.get('/api/posts', async (req,res)=>{
	var posts = (await getPosts());
	if(posts == "ERR") return res.send("ERR");
	res.send(posts);
})

app.get('/api/posts/:id',async (req,res)=>{
	var posts = (await getPostsByUser(req.params.id));
	if(posts == "ERR") return res.send("ERR");
	res.send(posts);
})

app.post('/api/post', async (req,res)=> {
	res.set("Content-Type","text/html");
	console.log(req.body)
	if(!req.verified) return res.status(401).send("UNAUTHORIZED");
	var created = await createPost(req.body);
	if(created) {
		res.send("OK");
	} else {
		res.send("ERR");
	}
})

app.get('/api/post/:id',async (req,res)=>{
	var post = (await getPost(req.params.id));
	if(post == "ERR") return res.send("ERR");
	res.send(post);
});

app.get('/api/post/:id/delete', async (req,res)=>{
	if(req.verified) {
		var result = await deletePost(req.params.id);
		if(result) {
			res.send("OK")
		} else {
			res.send("ERR")
		}
	} else {
		res.send("ERR");
	}
})

app.delete('/api/post/:id', async (req,res)=>{
	if(req.verified) {
		var result = await deletePost(req.params.id);
		if(result) {
			res.send("OK")
		} else {
			res.send("ERR")
		}
	} else {
		res.send("ERR");
	}
})

app.get('/api/post/:id/oembed',async (req,res)=>{
	var post = (await getPost(req.params.id));
	if(post == "ERR") return res.send("ERR");
	res.send({
		"type": "link",
	    "version": "1.0",
	    "title": post.title+" | Send Us into the Light",
	    "provider_name":"The Grey Skies",
	    "thumbnail_url": "https://greysdawn.tk/images/official.png",
	    "thumbnail_width": 32,
	    "thumbnail_height": 32
	});
});


//USERS

//get currently logged in user
app.get("/api/user",async (req,res)=>{
	res.send(req.cookies.user ? JSON.parse(req.cookies.user) : undefined);
})

//get all users
app.get('/api/users', async (req,res)=>{
	var users = await getUsers();
	if(users == "ERR") return res.send("ERR");
	res.send(users);
})

//
app.post('/api/user', async(req,res)=>{
	if(req.verified) {
		var created = await createUser(req.body);
		if(created) {
			res.send("OK");
		} else {
			res.send("ERR");
		}
	} else {
		res.send("ERR");
	}
})

app.get('/api/user/:id', async (req,res)=> {
	var user = await getUser(req.params.id);
	if(user == "ERR") return res.status(500).send("ERR");
	else if(!user) return res.status(404).send("NOT FOUND");
	else res.send(user);
})

app.get('/api/user/:id/delete', async (req,res)=>{
	if(req.verified) {
		var result = await deleteUser(req.params.id);
		if(result) {
			res.send("OK")
		} else {
			res.send("ERR")
		}
	} else {
		res.status(401).send("UNAUTHORIZED");
	}
})

app.delete('/api/user/:id',async (req,res)=>{
	if(req.verified) {
		var result = await deleteUser(req.params.id);
		if(result) {
			res.send("OK")
		} else {
			res.send("ERR")
		}
	} else {
		res.status(401).send("UNAUTHORIZED");
	}
})

app.post('/api/login', async (req,res)=> {
	if(req.verified) {
		res.cookie('user', JSON.stringify(req.user), { expires: new Date('01/01/2030'), httpOnly: true });
		res.status(200).send("OK");
	} else {
		res.status(401).send("UNAUTHORIZED");
	}
});

//PROJECTS

app.get('/api/projects', async (req,res)=> {
	var projects = await getProjects();
	await Promise.all(projects.map(async (proj,ind) => {
		if(proj.github) {
			var dat = await fetch(`https://api.github.com${proj.github.replace("/git/api","")}`);
			var json = await dat.json();
			var n = proj.links.length-1;
			json.assets.forEach((a,i) => {
				proj.links[n].buttons[i] = {name: proj.release_names[i], url: a.browser_download_url};
			})
			projects[ind] = proj;
			return new Promise(res => {
				setTimeout(()=> res(1), 100)
			})
		}
	}))
	res.send(projects);
})

app.get('/api/project/:id', async (req,res)=> {
	var proj = await getProject(req.params.id);
	if(proj) res.send(proj);
	else res.status(404).send('NOT FOUND');
})

app.post('/api/project', async (req,res)=> {
	if(req.verified) {
		var created = await createProject(req.body);
		if(created) res.send('OK');
		else res.status(500).send('ERR');
	} else {
		res.status(401).send("UNAUTHORIZED");
	}
})

app.get('/api/project/:id/delete', async (req,res)=> {
	if(req.verified) {
		var deleted = await deleteProject(req.params.id);
		if(deleted) res.send('OK');
		else res.status(500).send('ERR');
	} else {
		res.status(401).send("UNAUTHORIZED");
	}
})

app.delete('/api/project/:id', async (req,res)=> {
	if(req.verified) {
		var deleted = await deleteProject(req.params.id);
		if(deleted) res.send('OK');
		else res.status(500).send('ERR');
	} else {
		res.status(401).send("UNAUTHORIZED");
	}
})

//SYSID

app.get('/api/sysid', async (req, res)=> {
	var id = await getSysID();
	res.send({id: id});
})

app.put('/api/sysid', async (req,res)=> {
	if(req.verified) {
		var updated = await updateSysID(req.body.id);
		if(updated) res.send('OK');
		else res.status(500).send('ERR')
	} else {
		res.status(401).send('UNAUTHORIZED');
	}
})

//CONTACTS

app.get('/api/contacts', async (req, res)=> {
	var contacts = await getContacts();
	res.send(contacts);
})


//OTHER APIS
app.get("/git/api/*",async (req,res)=>{
	var dat = await fetch(`https://api.github.com${req.path.replace("/git/api","")}`);
	var json = await dat.json();
	res.send(json);
})

app.get("/pk/api/*",async (req,res)=>{
	var dat = await fetch(`https://api.pluralkit.me${req.path.replace("/pk/api","")}`);
	var json = await dat.json();
	res.send(json);
})

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use("/*", async (req, res, next)=> {
	var index = fs.readFileSync(path.join(__dirname+'/frontend/build/index.html'),'utf8');
	index = index.replace('$TITLE','Send Us into the Light');
	index = index.replace('$DESC','Home of the Grey Skies');
	index = index.replace('$TWITDESC','Home of the Grey Skies');
	index = index.replace('$TWITTITLE','Send Us into the Light');
	index = index.replace('$OGTITLE','Send Us into the Light');
	index = index.replace('$OGDESC','Home of the Grey Skies');
	index = index.replace('$OEMBED','oembed.json');
	res.send(index);
})

app.listen(process.env.PORT || 8080);
console.log("Ready.");
// module.exports = app;