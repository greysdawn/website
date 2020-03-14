import React, {Component, Fragment as Frag} from 'react';

import './Flags.css';

class Thumbnail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			flag: this.props.flag
		}
	}

	render() {
		var flag = this.state.flag;
		return (
			<a href={`/flags/${flag.name}`} className="Flags-thumbnail" style={{backgroundImage: `url('/${flag.name}/simplified.png')`}}>
				<h1>{flag.name}</h1>
			</a>
		)
	}
}

export default Thumbnail;