import React, { Component } from 'react';
import axios from 'axios';
import * as showdown from 'showdown';
var conv = new showdown.Converter();

class CreateFlag extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  submitted: "not submitted",
		  hid: "",
		  desc: "",
		  flagname: "",
		  category: "",
		  panels: []
		}
	}

	handleChange = (e) => {
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
			var res = await axios.post('/api/flag', fd);
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
				<p className="App-success">Submitted! <a href={`/flags/${this.state.hid}`}>Link</a></p>
			)}
			<form onSubmit={this.handleSubmit} className="CreatePost-form" enctype="multipart/form-data">
				<input placeholder="name" type="text" onChange={this.handleChange} name="flagname" value={this.state.flagname}
					style= {{
						width: "25%",
						margin: "10px"
					}}
				/>
				<input placeholder="hid" type="text" onChange={this.handleChange} name="hid" value={this.state.hid}
					style= {{
						width: "25%",
						margin: "10px"
					}}
				/>
				<textarea name="desc" placeholder="description" onChange={this.handleChange}
					style = {{
						height: "50%",
						resize: "none",
					}}
				>{this.state.desc}</textarea>
				<input placeholder="category" type="text" onChange={this.handleChange} name="category" value={this.state.category}
					style= {{
						width: "25%",
						margin: "10px"
					}}
				/>
				<input type="file" onChange={this.handleChange} name="panels" files={this.state.files} multiple/>
				<button type="submit" value="submit">Submit</button>
			</form>
			</div>
		);
	}
}

export default CreateFlag;