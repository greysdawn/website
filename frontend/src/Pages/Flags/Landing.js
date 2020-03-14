import React, {Component, Fragment as Frag} from 'react';
import axios from 'axios';
import Category from './Category';
import './Flags.css';

class FLanding extends Component {
	constructor(props) {
		super(props);

		this.state = {
			flags: null,
			fetched: false
		}
	}

	async componentDidMount() {
		var c = await axios('/api/flags');
		if(c.status == 200) {
			this.setState({flags: c.data, fetched: true});
		} else {
			this.setState({fetched: true});
		}
	}

	render() {
		var flags = this.state.flags;
		return (
			<div className="App-container">
				<section className="App-top">
	              <h1>Flag <span className="App-light">Emporium</span></h1>
	              <p>All the flags we've made</p>
	       		 </section>
	        	<section className="Comics-list">
					{flags ? Object.keys(flags).map((f) => {
						return (
							<Category key={f} name={f} flags={flags[f]}/>
						);
					}) : (this.state.fetched ? <p>Something went wrong</p> : <p>Loading...</p>)}
				</section>
			</div>
		);
	}
}

export default FLanding;