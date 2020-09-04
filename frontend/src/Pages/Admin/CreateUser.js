import React, { Component } from 'react';
import * as fetch from 'node-fetch';

class CreateUser extends Component {
	constructor() {
		super();
		this.state = {
			user: {},
			submitted: "not submitted",
			name: "username",
			pass: "password",
			bio: "bio",
			avatar_url: "avatar url"
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount() {
		var us = await fetch('/api/loggedin');
		if(us.status == 200) {
			var json = await us.json();
			this.setState({user: json, cur_name: json.name, cur_pass: json.pass})
		} else {
			this.setState({user: "ERR"});
		}
	}

	handleChange(name, e) {
		const n = name;
		const val = e.target.value;
		this.setState((state) => {
			state[n] = val;
			return state;
		})
	}

	async handleSubmit(e) {
		e.preventDefault();
		var st = this.state;

		var res = await fetch('/api/user', {
			method: "POST",
			body: JSON.stringify(st),
			headers: {
				"Content-Type": "application/json"
			}
		});

		if(res.status == 200) {
			this.setState({submitted: true})
			console.log(await res.text());
		} else {
			this.setState({submitted: false});
		}
	}

	setUser(user) {
		this.setState({user: user});
	}

	render() {
		if(this.state.submitted == "not submitted") {
			return(
				<section className="Admin-content">
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
				<label>
				Avatar:{" "}
				<input type="text" onChange={(e)=>this.handleChange("avatar_url",e)} name="pass" value={this.state.avatar_url}/>
				</label>
				<br/>
				<label>
				Bio:{" "}
				<textarea onChange={(e)=>this.handleChange("bio",e)} name="bio">{this.state.bio}</textarea>
				</label>
				<button type="submit" value="submit">Submit</button>
				</form>
				</section>
				);
		} else if(this.state.submitted == true) {
			return (
				<section>
				<p>User created!</p>
				</section>
				)
		} else {
			return (
				<section>
				<p>Something went wrong</p>
				</section>
				)
		}
	}
}

export default CreateUser;