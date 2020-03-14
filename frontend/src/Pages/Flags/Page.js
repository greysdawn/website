import React, {Component, Fragment as Frag} from 'react';
import axios from 'axios';

class FPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: this.props.match.params.name,
			fetched: false
		}
	}

	async componentDidMount() {
		var f = await axios('/api/flag/'+this.state.name);
		console.log(f.data);
		if(f.status == 200) {
			this.setState({flag: f.data, fetched: true})
		} else {
			this.setState({fetched: true});
		}
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
				<div className="Flags-flag">
				{
					flag.images.map((img, i) => {
						var imgname = img.replace(".png","").replace("-"," ").toUpperCase();
						return (
							<div className="Flag-imgwrapper">
							<p>{imgname}</p>
							<img src={`/${flag.name}/${img}`} key={i} alt={`${flag.name} - ${imgname.toLowerCase()} variant`}/>
							</div>
						)
					})
				}
				</div>
				<div className="Flags-description">
				<h1 style={{textAlign: "center"}}>Description</h1>
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