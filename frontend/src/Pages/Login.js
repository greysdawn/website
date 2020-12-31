import React, { Component } from 'react';
import * as fetch from 'node-fetch';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			pass: '',
			submitted: false
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

		var res = await fetch('/api/login', {
			method: "POST",
			body: JSON.stringify(st),
			headers: {
				"Content-Type": "application/json"
			}
		});


		if(res.status == 200) {
			res = await fetch('/api/user');
			this.setState({submitted: true, user: await res.json()});
			if(this.props.onSubmit) this.props.onSubmit(this.state.user);
		} else {
			this.setState({submitted: false});
		}
	}

	render() {
		return (
			<section>
				<form onSubmit={this.handleSubmit} style={{marginTop: '50px'}}>
				<input
					type='text' name='name' value={this.state.name}
					placeholder='name' onChange={this.handleChange}
				/>
				<br />
				<input
					type='text' name='pass' value={this.state.pass}
					placeholder='pass' onChange={this.handleChange}
				/>
				<br />
				<button type="submit">Submit</button>
				</form>
			</section>
		)
	}
}

export default Login;