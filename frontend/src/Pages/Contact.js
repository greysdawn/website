import React, {Component, Fragment as Frag} from 'react';


class Contact extends Component {
	constructor(props) {
		super(props);

		this.state = {list: this.props.list}
	}
	render() {
		var list = this.state.list || [];
		return (
			<div className="App-container">
				<section className="App-top">
	              <h1>Other <span className="App-light">Sites</span></h1>
	              <p>Other places to find us</p>
	       		 </section>
	        	<section className="App-list">
					{list.map((c,i) => {
						return (
							<a key={i}
								className="App-button App-listitem App-contact"
								style={{animationDelay: (i*.125)+"s"}}
								href={c.url}
								onMouseOut={(e)=> {
				                    e.target.classList.add('notHovered');
				                  }}
								>
							{c.name}
							</a>
						);
					})}
				</section>
			</div>
		);
	}
}

export default Contact;