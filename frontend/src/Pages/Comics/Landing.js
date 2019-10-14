import React, {Component, Fragment as Frag} from 'react';
import axios from 'axios';
import Story from './Story';
import './Comics.css';



class Landing extends Component {
	constructor(props) {
		super(props);

		this.state = {
			comics: null,
			fetched: false
		}
	}

	async componentDidMount() {
		var c = await axios('/api/comics');
		if(c.status == 200) {
			this.setState({comics: c.data, fetched: true});
		} else {
			this.setState({fetched: true});
		}
	}

	render() {
		var comics = this.state.comics;
		return (
			<div className="App-container">
				<section className="App-top">
	              <h1>Grey Skies <span className="App-light">Silver Lining</span></h1>
	              <p>A collection of comics we've made</p>
	       		 </section>
	        	<section className="Comics-list">
					{comics ? Object.keys(comics).map((c) => {
						return (
							<Story key={c} name={c} comics={comics[c]}/>
						);
					}) : (this.state.fetched ? <p>Something went wrong</p> : <p>Loading...</p>)}
				</section>
			</div>
		);
	}
}

export default Landing;