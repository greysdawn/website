import React, {Component, Fragment as Frag} from 'react';

import Thumbnail from './Thumbnail';
import './Comics.css';

class Story extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comics: this.props.comics,
			name: this.props.name
		}
	}

	render() {
		var comics = this.state.comics;
		return (
			<div className="Comics-story">
			<h1>{this.state.name}</h1>
			<div className="Comics-clist">
			{comics.map(c => {
				return (<Thumbnail key={c.hid} comic={c} />)
			})}
			</div>
			</div>
		)
	}
}

export default Story;