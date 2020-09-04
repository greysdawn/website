import React, { Component } from 'react';

class NotFound extends Component {
	constructor(props) {
		super(props);

		this.state = {list: this.props.list}
	}

	render() {
		return (
			<div className="App-container">
	          <section className="App-top">
	              <h1>Page Not Found</h1>
	          </section>
	          <section className="App-about">
	          	<div>
	          	Sorry! That page wasn't found.<br/>
	          	Try using one of the links at the top of{" "}
	          	the page to get where you want to go.
	          	</div>
	          </section>
	        </div>
		);
	}
}

export default NotFound;