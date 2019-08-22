import React, { Component } from 'react';
import * as fetch from 'node-fetch';

class Login extends Component {
	constructor() {
		super();
		this.state = {
						name: "name",
						pass: "pass",
						submitted: "not submitted"
					}

	}

	async componentDidMount() {
		var us = await fetch('/api/loggedin');
		if(us.status == 200) {
			var json = await us.json();
			this.setState({user: json, name: json.name, pass: json.pass})
		} else {
			this.setState({user: "ERR"});
		}
	}

	handleChange = (name, e) => {
		const n = name;
		const val = e.target.value;
		this.setState((state) => {
			state[n] = val;
			return state;
		})
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		var st = this.state;

		var res = await fetch('/api/login', {
			method: "POST",
			body: JSON.stringify(st),
			headers: {
				"Content-Type": "application/json"
			}
		});

		if(res.status == 200) {
			this.setState({submitted: true})
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
			);
		} else if(this.state.submitted == true) {
			return (
				<section>
				<p>Logged in!</p>
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

export default Login;