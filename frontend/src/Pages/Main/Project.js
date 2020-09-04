import React, { Component, Fragment } from 'react';
import * as fetch from 'node-fetch';

import GalleryCard from './GalleryCard';

class Project extends Component {
	constructor(props) {
		super(props);
		this.state = {path: this.props.match.params.id, project: this.props.project || undefined}
	}

	render() {
		var path = this.state.path;
		var p = this.state.project;
		if(p) {
			return (
				<div className="App-container">
				<section className="App-top App-land" style={{backgroundImage: (p.background ? `url(${p.background})` : '')}}>
				<h1>{p.title[0]}<span className="App-light">{p.title[1]}</span></h1>
				{p.description && <p>{p.description}</p>}
				</section>
				<section className="App-about">
				<h1>ABOUT</h1>
				<img className="App-icon" src={`/${path}.png`} />
				<p className="App-projAbout">{p.about}</p>
				</section>
				{p.gallery[0] &&
					(
						<section className="App-list App-gallery">
						{p.gallery.map((item,k)=> {
							return (
								<GalleryCard key={k} k={k} image={item.image} alt={item.alt} />
							)
						})}
						</section>
					)
				}
				{p.links[0] && p.links.map((k,i)=>{
					if(!k.buttons || !k.buttons[0]) return;
					return (
						<section className="App-projlinks">
						<h1 style={{color: "white"}}>{k.label}</h1>
						<section className="App-list">
						{k.buttons.map((l,j)=>{
							return (
								<div key={j}
									className="App-button App-listitem App-contact"
									style={{animationDelay: (j*.125)+"s"}}
									onClick={()=> window.open(l.url)}
									onMouseOut={(e)=> {
										e.target.classList.add('notHovered');
									}}
								>
								{l.name}
								</div>
							);
						})}
						</section>
						</section>
					);
				})}
				</div>
				);
		} else {
			return (
				<p>404 - Project not found</p>
			)
		}
	}
}

export default Project;