import React, {Component, Fragment as Frag} from 'react';

import Thumbnail from './Thumbnail';
import './Flags.css';

class Category extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flags: this.props.flags,
			name: this.props.name
		}
	}

	render() {
		var flags = this.state.flags;
		return (
			<div className="Flags-category">
			<h1>{this.state.name}</h1>
			<div className="Flags-flist">
			{flags.map(f => {
				return (<Thumbnail key={f.name} flag={f} />)
			})}
			</div>
			</div>
		)
	}
}

export default Category;