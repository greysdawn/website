import React, { Component } from 'react';
import axios from 'axios';

import './CreatePost.css'

class CreatePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  user_id: this.props.user.hid,
		  submitted: false,
		  error: null,
		  tags: "",
		  body: "",
		  cover_url: "",
		  title: ""
		}
	}

	handleChange = (e, raw) => {
		const name = e.target.name;
		const val = e.target.value ;
		this.setState((state) => {
			state[name] = val;
			return state;
		})
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		var st = this.state;
		st.tags = st.tags.split(/,\s?/g);

		try {
			var res = await axios.post('/api/post', st);
		} catch(e) {
			return this.setState({error: e.toString()})
		}

		this.setState({submitted: true, hid: res.data.hid})
	}

	render() {
		return(
			<div className="Admin-content">
			{this.state.error && (<p className="App-error">{this.state.error}</p>)}
			{this.state.submitted && (
				<p className="App-success">Submitted! <a href={`/blog/post/${this.state.hid}`}>Link</a></p>
			)}
			<form onSubmit={this.handleSubmit} className="CreatePost-form">
				<input placeholder="title" type="text" onChange={(e)=>this.handleChange(e)} name="title" value={this.state.title}/>
				<textarea placeholder="body" name="body" onChange={this.handleChange}>
				{this.state.body}
				</textarea>
				<input placeholder="cover_url" type="text" onChange={(e)=>this.handleChange(e)} name="cover_url" value={this.state.cover_url}/>
				<input placeholder="tags" type="text" onChange={(e)=>this.handleChange(e)} name="tags" value={this.state.tags}/>
				<button type="submit" value="submit">Submit</button>
			</form>
			</div>
		);
	}
}

export default CreatePost;