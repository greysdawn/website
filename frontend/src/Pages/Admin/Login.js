import React, { Component } from 'react';
import * as axios from 'axios';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			password: '',
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

		try {
			var res = await axios.post('/api/login', st);
		} catch(e) {
			return this.setState({error: e.toString()})
		}

		res = await axios('/api/user');
		this.setState({submitted: true, user: res.data});
		if(this.props.onSubmit) this.props.onSubmit(this.state.user);
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
					type='text' name='password' value={this.state.password}
					placeholder='password' onChange={this.handleChange}
				/>
				<br />
				<button type="submit">Submit</button>
				</form>
			</section>
		)
	}
}

export default Login;