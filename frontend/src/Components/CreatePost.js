import React, { Component } from 'react';
import axios from 'axios';
import {stateToHTML} from 'draft-js-export-html';

import RichText from './RichText';

import './CreatePost.css'

class CreatePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
					  id: this.props.user.id,
					  submitted: "not submitted",
					  tags: "",
					  body: "",
					  cover_url: "",
					  title: ""
					}
	}

	handleChange = (e, raw) => {
		if(e.target) {
			const name = e.target.name;
			const val = e.target.value ;
			this.setState((state) => {
				state[name] = val;
				return state;
			})
		} else {
			this.setState((state) => {
				state["body"] = raw;
				return state;
			})
		}
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		var st = this.state;
		st.body = stateToHTML(st.body)

		try {
			var res = await axios.post('/api/post', st);
		} catch(e) {
			var res = {status: 500}
		}

		if(res.status == 200) {
			this.setState({submitted: true})
		} else {
			this.setState({submitted: false});
		}
	}

	render() {
		if(this.state.submitted == "not submitted") {
			return(
				<section className="Admin-content">
				<form onSubmit={this.handleSubmit} className="CreatePost-form">
					<input placeholder="title" type="text" onChange={(e)=>this.handleChange(e)} name="title" value={this.state.title}/>
					<RichText placeholder="body" name="body" onChange={this.handleChange} />
					<input placeholder="cover_url" type="text" onChange={(e)=>this.handleChange(e)} name="cover_url" value={this.state.cover_url}/>
					<input placeholder="tags" type="text" onChange={(e)=>this.handleChange(e)} name="tags" value={this.state.tags}/>
					<button type="submit" value="submit">Submit</button>
				</form>
				</section>
			);
		} else if(this.state.submitted == true) {
			return (
				<section>
				<p>Submitted!</p>
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

export default CreatePost;