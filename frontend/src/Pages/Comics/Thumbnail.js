import React, {Component, Fragment as Frag} from 'react';

import './Comics.css';

class Thumbnail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			comic: this.props.comic
		}
	}

	render() {
		var comic = this.state.comic;
		return (
			<a href={`/comics/${comic.hid}`} className="Comics-thumbnail" style={{backgroundImage: `url('/${comic.hid}/thumb.png')`}}>
				<h1>{comic.name}</h1>
			</a>
		)
	}
}

export default Thumbnail;