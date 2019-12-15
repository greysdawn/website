import React, { Component } from 'react';

import ProjectCard from '../Components/ProjectCard';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {list: this.props.list}
	}

	render() {
		var list = this.state.list;
		console.log(list);
		if(list) {
			return (
				<div className="App-container">
		          <section className="App-top App-land" style={{backgroundImage: 'url(https://cdn.discordapp.com/attachments/481322557925228544/613205149275652107/sysflag_decorated.png)'}}>
		              <h1>Send Us Into the <span className="App-light">Light</span></h1>
		              <p>Home of the Grey Skies | Writers, artists, musicians, and devs</p>
		          </section>
		          <section className="App-about">
		            <h1>ABOUT</h1>
		            <div className="App-info">
		            <p>My name is Grey Himmel. I am transmasculine and prefer he/him or they/them pronouns. As of writing this, I am 19 years old and working on a handful of passion projects. To date I have created several Discord bots, coded this website from scratch, and contributed to a few other projects.</p>
		            <p>I also consider myself an activist, mainly an advocate for better health care, especially mental health care, and rights for marginalized people. As a trans person living with Dissociative Identity Disorder, it's a shame knowing that I have to fight to prove myself worthy of getting a job and even just existing. I hope to make that fight easier- or, rather, non-existent- for future generations.</p>
		            <p>Aside from coding projects, I like to make music and art. Soon I hope to make more Youtube videos and stream on Twitch as well. I also work on games from time to time, mainly using the LOVE2D framework. I'm also part of a robotics team, and am hoping to become a programming mentor.</p>
		            </div>
		          </section>
		          <section className="App-bottom">
		            <h1>PROJECTS</h1>
		            <section className="App-list" style={{backgroundColor: 'transparent'}}>
		            {
		            	list.map((p,i) => {
		            		return (
		            			<ProjectCard key={i} proj={p} />
		            		)
		            	})
		            }
		            <ProjectCard  />
		            </section>
		          </section>
		        </div>
			);
		} else {
			return (
				<p>Loading...</p>
			)
		}

	}
}

export default Home;