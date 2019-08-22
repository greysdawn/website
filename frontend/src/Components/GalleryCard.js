import React, { Component } from 'react';

const images = require.context("../Images");

class GalleryCard extends Component {

	constructor(props) {
		super(props);

		this.state = {key: this.props.k, image: this.props.image, alt: this.props.alt};
	}

	render() {
		return (
			<div
				className="App-listitem App-gallItem"
				style={{animationDelay: (this.state.key*.25)+"s","animationDuration":".25s"}}>
				<img className="App-gallImg"
					onClick={()=>window.open(images("./"+this.state.image),'_self')}
					src={images("./"+this.state.image)}
					alt={this.state.alt}
				/>
			</div>
			
		)
	}

}

export default GalleryCard;