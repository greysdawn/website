import React, { Component, Fragment } from 'react';
import axios from 'axios';

import MemberCard from '../Components/MemberCard';

const images = require.context("../Images");

class System extends Component {
	constructor(props) {
		super(props);
		this.state = {sys: null}
	}

	async componentDidMount() {
		var sys = await axios(`/api/sysmembs`);
		this.setState({ sys: sys.data});
	}

	render() {
		var sys = this.state.sys;
			return (

				<div className="App-container">
				<section className="App-top">
				<h1>The <span className="App-light">System</span></h1>
				<p>The people here</p>
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