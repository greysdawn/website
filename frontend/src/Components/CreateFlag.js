import React, { Component } from 'react';
import axios from 'axios';
import * as showdown from 'showdown';
import {stateToHTML} from 'draft-js-export-html';

import RichText from './RichText';


var conv = new showdown.Converter();

class CreateFlag extends Component {
	constructor(props) {
		super(props);
		this.state = {
					  submitted: "not submitted",
					  tagline: "",
					  desc: "",
					  flagname: "",
					  category: "",
					  panels: []
					}
	}

	handleChange = (e, raw) => {
		if(e.target) {
			const name = e.target.name;
			const val = e.target.files ? Array.from(e.target.files) : e.target.value;
			this.setState((state) => {
				state[name] = val;
				return state;
			})
		} else {
			this.setState((state) => {
				state["desc"] = raw;
				return state;
			})
		}
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		var st = this.state;
		st.desc = stateToHTML(st.desc);

		var fd = new FormData();
		Object.keys(st).map(k => k!="panels" && fd.append(k, st[k]));

		st.panels.map(f => {
			fd.append("panels", f);
		})

		try {
			var res = await axios.post('/api/flag', fd);
		} catch(e) {
			var res = {status: 500};
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
				<form onSubmit={this.handleSubmit} className="CreatePost-form" enctype="multipart/form-data">
					<input placeholder="name" type="text" onChange={(e)=>this.handleChange(e)} name="flagname" value={this.state.flagname}
						style= {{
							width: "25%",
							margin: "10px"
						}}
					/>
					<RichText name="desc" placeholder="description" onChange={this.handleChange} />
					<input placeholder="category" type="text" onChange={(e)=>this.handleChange(e)} name="category" value={this.state.category}
						style= {{
							width: "25%",
							margin: "10px"
						}}
					/>
					<input type="file" onChange={(e)=>this.handleChange(e)} name="panels" files={this.state.files} multiple/>
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

export default CreateFlag;