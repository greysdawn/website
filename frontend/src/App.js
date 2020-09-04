import React, { Component, Fragment as Frag } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import axios from 'axios';
import './App.css';

import Home     from './Pages/Main/Home';
import Contact  from './Pages/Main/Contact';
import Project  from './Pages/Main/Project';
import System   from './Pages/Main/System';
import Blog     from './Pages/Blog/Blog';
import Post     from './Pages/Blog/Post';
import Admin    from './Pages/Admin/Admin';

import CLanding from './Pages/Comics/Landing';
import CPage from './Pages/Comics/Page';

import FLanding from './Pages/Flags/Landing';
import FPage from './Pages/Flags/Page';

import NotFound from './Pages/NotFound';

class App extends Component {
	constructor() {
		super();
		this.state = {
			projects: undefined,
			contacts: undefined,
			login: {name: undefined, pass: undefined},
			user: undefined,
			nav: false
		};
	}
	async componentDidMount() {
		var projects = (await axios('/api/projects')).data;
		var contacts = (await axios('/api/contacts')).data;
		try {
			var user = (await axios('/api/user')).data;
		} catch(e) {
			user = undefined;
		}
		this.setState({projects: projects, contacts: contacts, user: user});
	}

	handleChange = (name, e) => {
		const n = name;
		const val = e.target.value;
		this.setState((state) => {
			state.login[n] = val;
			return state;
		})
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		var st = this.state.login;

		var res = await fetch('/api/login', {
			method: "POST",
			body: JSON.stringify(st),
			headers: {
				"Content-Type": "application/json"
			}
		});


		if(res.status == 200) {
			res = await fetch('/api/user');
			this.setState({submitted: true, user: await res.json()})
		} else {
			this.setState({submitted: false});
		}
	}

	toggleNav = (e) => {
		e.preventDefault();
		this.setState({nav: !this.state.nav});
	}

	render() {
		var links = ["home","contact","system","blog"];
		if(!this.state.projects) {
			return null;
		} else {
			return (
				<div className="App">
				<header className="App-header">
				<p>grey skies</p>
				<div className="App-navlinks">
					{links.map((v, i) => {
						return <a  key={i} href={`/${v == "home" ? "" : v}`}>{v}</a>
					})}
						<button className="App-button App-projbutton"
							onClick={this.toggleNav}
						>
							projects
						</button>
				</div>
				<button className="App-button App-menubutton" onClick={this.toggleNav}>
					Menu
				</button>
				</header>
				<div className={"App-menu" + (this.state.nav ? " open" : "")}>
					<h2>Main Pages</h2>
					<div>
					{links.map((v,i)=>{
						return (
							<a key={'mobile-'+i} href={`/${v == "home" ? "" : v}`}>{v}</a>
						);
					})}
					</div>
	                <h2>Projects</h2>
	                <div>
	                <a href="/comics">Comics</a>
	                <a href="/flags">Flags</a>
	                </div>
                </div>
                <div className={"App-projnav" + (this.state.nav ? " open" : "")}>
                	<a href="/comics">Comics</a>
	                <a href="/flags">Flags</a>
                </div>

				<Router>
					<Switch>
					<Route path="/" exact render={(props)=><Home {...props} list={this.state.projects} />}/>
					<Route path="/contact" render={(props)=><Contact {...props} list={this.state.contacts} />}/>
					<Route path="/system" render={(props)=><System {...props}/>} />
					<Route path="/blog" exact render={(props)=><Blog {...props} />} />
					<Route path="/blog/post/:id" exact render={(props)=><Post {...props}/>} />
					<Route path="/comics" exact render={(props)=><CLanding {...props}/>} />
					<Route path="/comics/:hid" exact render={(props)=><CPage {...props}/>} />
					<Route path="/flags" exact render={(props)=><FLanding {...props}/>} />
					<Route path="/flags/:hid" exact render={(props)=><FPage {...props}/>} />

					{
						this.state.user ?
						<Route path="/admin" render={(props)=> <Admin {...props} user={this.state.user} />} /> :
						<Route path="/admin" render={(props)=> 
							<Frag>
							<form onSubmit={this.handleSubmit} className="Admin-form">
							<label>
							Name:{" "}
							<input type="text" onChange={(e)=>this.handleChange("name",e)} name="name" value={this.state.name}/>
							</label>
							<br/>
							<label>
							Pass:{" "}
							<input type="text" onChange={(e)=>this.handleChange("pass",e)} name="pass" value={this.state.pass}/>
							</label>
							<br/>
							<button type="submit">Submit</button>
							</form>
							</Frag>
						}
						/>
					}
					<Route component={NotFound} />
					</Switch>
				</Router>
				<footer>© the grey skies 2020</footer>
				</div>
				);
		}
	}

	//temporarily removing
	/*
		{this.state.projects.map((p, o) => {
        	return <a href={`/project/${p.id}`}>{p.name}</a>
        })}
	*/
	//<Route path="/project/:id" render={(props)=><Project {...props} project={this.state.projects.find(p => p.id == props.match.params.id)}/>} />
}

export default App;
