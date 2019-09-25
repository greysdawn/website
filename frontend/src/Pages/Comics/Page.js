import React, {Component, Fragment as Frag} from 'react';

class Page extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hid: this.props.match.params.hid,
			fetched: false
		}
	}

	async componentDidMount() {
		var c = await fetch('/api/comic/'+this.state.hid);
		if(c.status == 200) {
			var dat = await c.json();
			this.setState({comic: dat, fetched: true})
		} else {
			this.setState({fetched: true});
		}
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
				<div className="Comics-comic">
				{
					comic.images.map((img, i) => {
						if(img != "thumb.png") return <img src={`/${comic.hid}/${img}`} key={i} alt={`panel ${i+1}`}/>
					})
				}
				</div>
				<div className="Comics-description">
				<h1 style={{textAlign: "center"}}>Description</h1>
				<p dangerouslySetInnerHTML={{__html: comic.desc}}></p>
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

export default Page;