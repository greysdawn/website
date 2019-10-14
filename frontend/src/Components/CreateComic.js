import React, { Component } from 'react';
import axios from 'axios';
import * as showdown from 'showdown';
import {stateToHTML} from 'draft-js-export-html';

import RichText from './RichText';


var conv = new showdown.Converter();

class CreateComic extends Component {
	constructor(props) {
		super(props);
		this.state = {
					  submitted: "not submitted",
					  hid: "",
					  tagline: "",
					  desc: "",
					  comicname: "",
					  story: "",
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
			console.log(raw);
			this.setState((state) => {
				state["desc"] = raw;
				return state;
			})
		}
	}

	// custom block parser, probably won't be finished in favor of draft-js-export-html
	// parseBlocks = async (blocks) => {
	// 	var html = "";
	// 	blocks.forEach(block => {
	// 		var text = block.text;
	// 		var tmp = [];
	// 		switch(block.type) {
	// 			case "header-one":
	// 				tmp.push("<h1>");
	// 				break;
	// 			case "header-two":
	// 				tmp.push("<h2>");
	// 				break;
	// 			case "header-three":
	// 				tmp.push("<h3>");
	// 				break;
	// 			case "unstyled":
	// 				tmp.push("<p>");
	// 				break;
	// 		}

	// 		var styleParts = block.inlineStyleRanges.map(s => {
	// 			return {text: }
	// 		})

	// 		block.inlineStyleRanges.forEach(style => {

	// 			switch(style) {
	// 				case "BOLD":
	// 					text = [text.slice(0,
	// 							style.offset),
	// 							"<strong>",
	// 							text.slice(style.offset,
	// 							style.offset+style.length),
	// 							"</strong>",
	// 							text.slice(style.offset+stye.length)
	// 						].join('');
	// 					break;
	// 				case "ITALIC":
	// 					break;
	// 			}
	// 		})
	// 	})
	// }

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
			var res = await axios.post('/api/comic', fd);
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
					<RichText name="desc" placeholder="description" onChange={this.handleChange} />
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

export default CreateComic;