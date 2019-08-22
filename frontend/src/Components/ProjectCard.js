import React, { Component } from 'react';

class ProjectCard extends Component {
	constructor(props) {
		super(props);

		this.state = {
			key: 	this.props.key,
			proj: 	this.props.proj 
		}
	}

	render() {
		var proj = this.state.proj
		if(proj) {
			return (
				<a
					className="App-listitem App-projectCard"
					style={{animationDelay: (this.state.key*.25)+"s","animationDuration":".25s"}}
					href={"/project/"+proj.id}>
				<h1>
					{proj.name}
				</h1>
				<span className="App-tagline">{proj.tag}</span>
				<p>{proj.description}</p>
				</a>
			);
		} else {
			return null;
		}
	}
}

export default ProjectCard;