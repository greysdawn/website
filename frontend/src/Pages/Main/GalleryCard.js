import React, { Component } from 'react';


class GalleryCard extends Component {

	constructor(props) {
		super(props);

		this.state = {key: this.props.k, image: this.props.image, alt: this.props.alt};
	}

	render() {
		return (
			<div
				className="App-listitem App-gallItem"
				style={{animationDelay: (this.state.key*.25)+"s","animationDuration":".5s"}}>
				<img className="App-gallImg"
					onClick={()=>window.open("/"+this.state.image,'_blank')}
					src={"/"+this.state.image}
					alt={this.state.alt}
				/>
			</div>
			
		)
	}

}

export default GalleryCard;