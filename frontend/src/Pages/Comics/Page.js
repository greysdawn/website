import React, {Component, Fragment as Frag} from 'react';
import axios from 'axios';

class CPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hid: this.props.match.params.hid,
			fetched: false
		}

		this.ref = React.createRef();
	}

	async componentDidMount() {
		var c = await axios('/api/comic/'+this.state.hid);
		if(c.status == 200) {
			this.setState({comic: c.data, fetched: true})
		} else {
			this.setState({fetched: true});
		}
	}

	jump = (e) => {
		e.preventDefault();
		this.ref.current.scrollIntoView({
			behavior: 'smooth',
          	block: 'start'
		});
	}

	render() {
		var comic = this.state.comic;
		if(comic) {
			return (
				<div className="App-container">
				<section className="App-top">
	              <h1>{comic.name}</h1>
	              <p><em>{comic.tagline}</em></p>
	       		</section>
	       		<section className="Comics-page">
	       		<button className="Comics-button" onClick={this.jump}>Jump to descriptions</button>
				<div className="Comics-comic">
				{
					comic.images.map((img, i) => {
						if(img != "thumb.png" && img.endsWith('.png')) return <img src={`/${comic.hid}/${img}`} key={i} alt={`panel ${i+1}`}/>
					})
				}
				</div>
				<div className="Comics-description" ref={this.ref}>
				<h1 style={{textAlign: "center"}}>Description</h1>
				<p dangerouslySetInnerHTML={{__html: comic.description}}></p>
				</div>
				<div className="Comics-buttons">
				<a className={"Comics-button"+(comic.prev ? "" : " Comics-disabled")} href={comic.prev ? `/comics/${comic.prev}` : ''}>Previous</a>
				<a className={"Comics-button"+(comic.next ? "" : " Comics-disabled")} href={comic.next ? `/comics/${comic.next}` : ''}>Next</a>
				</div>
				</section>
				</div>
			)
		} else if(!comic && !this.state.fetched) {
			return (<p>Loading</p>);
		} else {
			return (<p>Something went wrong</p>);
		}
	}
}

export default CPage;