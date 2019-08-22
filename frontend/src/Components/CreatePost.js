import React, { Component } from 'react';
import * as fetch from 'node-fetch';
import * as showdown from 'showdown';

import './CreatePost.css'

var conv = new showdown.Converter();

class CreatePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
					  id: this.props.user.id,
					  submitted: "not submitted",
					  tags: "tags",
					  body: "body",
					  cover_url: "cover",
					  title: "title"
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
		st.body = conv.makeHtml(st.body)

		var res = await fetch('/api/post', {
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

	render() {
		if(this.state.submitted == "not submitted") {
			return(
				<section className="Admin-content">
				<form onSubmit={this.handleSubmit} className="CreatePost-form">
					Title:{" "}
					<input type="text" onChange={(e)=>this.handleChange("title",e)} name="title" value={this.state.title}/>
					<br/>
					Body:{" "}
					<textarea className="CreatePost-body" onChange={(e)=>this.handleChange("body",e)} name="body">{this.state.body}</textarea>
					<br/>
					Cover:{" "}
					<input type="text" onChange={(e)=>this.handleChange("cover_url",e)} name="cover_url" value={this.state.cover_url}/>
					<br/>
					Tags:{" "}
					<input type="text" onChange={(e)=>this.handleChange("tags",e)} name="tags" value={this.state.tags}/>
					<button type="submit" value="submit">Submit</button>
				</form>
				<div className="CreatePost-preview"
					dangerouslySetInnerHTML={{__html: conv.makeHtml(this.state.body)}}
				>
				</div>
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