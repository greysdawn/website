import React, { Component, Fragment } from 'react';
import * as fetch from 'node-fetch';

import MemberCard from '../Components/MemberCard';

const images = require.context("../Images");

class System extends Component {
	constructor(props) {
		super(props);

		this.state = {id: this.props.id}
	}

	async componentDidMount() {
		if(this.state.id) {
			var sys = await fetch(`/pk/api/s/${this.state.id}/members`);
			this.setState({ sys: (await sys.json()).sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))});
		}
	}

	render() {
		var sys = this.state.sys;
			return (

				<div className="App-container">
				<section className="App-top">
				<h1>The <span className="App-light">System</span></h1>
				<p>The people here</p>
				</section>
				<section className="App-note">
				    <h1>NOTE</h1>
				    <p>Some members are called <em>introjects</em>-{" "}
				    people from fictional/factual sources. These people do not claim{" "}
				    to be <strong>the</strong> exact character; however, some have memories{" "}
				    related to their "source," and their identities are based greatly on the{" "}
				    character.<br/>Trust me, it's just as awkward for us as it is for you.</p>
				</section>
				<section className="App-list">
		            {sys ?
		            	sys.map((m,i) => {
		            		return (
		            			<MemberCard key={i} member={m} />
		            		)
		            	}) :

		            	<p>Loading...</p>
		            }
		        </section>
				</div>

				);
	}
}

export default System;