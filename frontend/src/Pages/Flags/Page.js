import React, {Component, Fragment as Frag} from 'react';
import axios from 'axios';

class FPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hid: this.props.match.params.hid,
			fetched: false
		}

		this.ref = React.createRef();
	}

	async componentDidMount() {
		var f = await axios('/api/flag/'+this.state.hid);
		console.log(f.data);
		if(f.status == 200) {
			this.setState({flag: f.data, fetched: true})
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
		var flag = this.state.flag;
		if(flag) {
			return (
				<div className="App-container">
				<section className="App-top">
	              <h1>{flag.name} Flag</h1>
	       		</section>
	       		<section className="Flags-page">
	       		<button className="Flags-button" onClick={this.jump}>Jump to descriptions</button>
				<div className="Flags-flag">
				{
					flag.images.map((img, i) => {
						if(img == "thumb.png") return null;
						var imgname = img.replace(".png","").replace("-"," ").toUpperCase();
						return (
							<div className="Flags-imgwrapper">
							<p>{imgname}</p>
							<a href={`/${flag.hid}/${img}`} target="_blank">
								<img src={`/${flag.hid}/${img}`} key={i} alt={`${flag.name} - ${imgname.toLowerCase()} variant`}/>
							</a>
							</div>
						)
					})
				}
				</div>
				<div className="Flags-description" ref={this.ref}>
				<p dangerouslySetInnerHTML={{__html: flag.desc}}></p>
				</div>
				<div className="Flags-buttons">
				<a className={"Flags-button"+(flag.prev ? "" : " Flags-disabled")} href={flag.prev ? `/flags/${flag.prev}` : ''}>Previous</a>
				<a className={"Flags-button"+(flag.next ? "" : " Flags-disabled")} href={flag.next ? `/flags/${flag.next}` : ''}>Next</a>
				</div>
				</section>
				</div>
			)
		} else if(!flag && !this.state.fetched) {
			return (<p>Loading</p>);
		} else {
			return (<p>Something went wrong</p>);
		}
	}
}

export default FPage;