import React, { Component } from 'react';
import axios from 'axios';
import * as showdown from 'showdown';
var conv = new showdown.Converter();

class CreateComic extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  submitted: false,
		  hid: "",
		  tagline: "",
		  desc: "",
		  comicname: "",
		  story: "",
		  panels: []
		}
	}

	handleChange = (e, raw) => {
		const name = e.target.name;
		const val = e.target.files ? Array.from(e.target.files) : e.target.value;
		this.setState((state) => {
			state[name] = val;
			return state;
		})
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		var st = this.state;

		var fd = new FormData();
		Object.keys(st).map(k => k!="panels" && fd.append(k, st[k]));

		st.panels.map(f => {
			fd.append("panels", f);
		})

		try {
			var res = await axios.post('/api/comic', fd);
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
				<p className="App-success">Submitted! <a href={`/comics/${this.state.hid}`}>Link</a></p>
			)}
			<form onSubmit={this.handleSubmit} className="CreatePost-form" enctype="multipart/form-data">
				<input placeholder="hid" type="text" onChange={(e)=>this.handleChange(e)} name="hid" value={this.state.hid}
					style= {{
						width: "25%",
						margin: "10px"
					}}
				/>
				<input placeholder="name" type="text" onChange={(e)=>this.handleChange(e)} name="comicname" value={this.state.comicname}
					style= {{
						width: "25%",
						margin: "10px"
					}}
				/>
				<textarea name="desc" placeholder="description" onChange={this.handleChange}>
				{this.state.desc}
				</textarea>
				<input placeholder="tagline" type="text" onChange={(e)=>this.handleChange(e)} name="tagline" value={this.state.tagline}
					style= {{
						width: "25%",
						margin: "10px"
					}}
				/>
				<input placeholder="story" type="text" onChange={(e)=>this.handleChange(e)} name="story" value={this.state.story}
					style= {{
						width: "25%",
						margin: "10px"
					}}
				/>
				<input type="file" onChange={(e)=>this.handleChange(e)} name="panels" files={this.state.files} multiple/>
				<button type="submit" value="submit">Submit</button>
			</form>
			</div>
		);
	}
}

export default CreateComic;