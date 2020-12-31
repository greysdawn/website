import React, { Component } from 'react';
import * as axios from 'axios';

class CreateUser extends Component {
	constructor() {
		super();
		this.state = {
			submitted: false,
			name: "",
			password: "",
			bio: "",
			avatar_url: ""
		}

	}

	handleChange = (e) => {
		const n = e.target.name;
		const val = e.target.value;
		this.setState((state) => {
			state[n] = val;
			return state;
		})
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		var st = this.state;

		try {
			var res = await axios.post('/api/user', JSON.stringify(st));
		} catch(e) {
			return this.setState({error: e.toString()})
		}

		this.setState({submitted: true})
	}

	render() {
		return(
			<div className="Admin-content">
			{this.state.error && (<p className="App-error">{this.state.error}</p>)}
			{this.state.submitted && (
				<p className="App-success">Submitted!</p>
			)}
			<form onSubmit={this.handleSubmit} className="Admin-form">
			<input
				type="text" onChange={this.handleChange}
				name="name" value={this.state.name} placeholder="name"
			/>
			<br/>
			<input
				type="text" onChange={this.handleChange}
				name="password" value={this.state.password} placeholder="password"
			/>
			<br/>
			<input
				type="text" onChange={this.handleChange}
				name="avatar_url" value={this.state.avatar_url} placeholder="avatar"
			/>
			<br/>
			<textarea onChange={this.handleChange} name="bio" placeholder="bio">
				{this.state.bio}
			</textarea>
			<br />
			<button type="submit" value="submit">Submit</button>
			</form>
			</div>
		);
	}
}

export default CreateUser;