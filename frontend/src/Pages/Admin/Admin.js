import React, {Component, Fragment as Frag} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './Admin.css';

import CreatePost from './CreatePost';
import CreateUser from './CreateUser';
import CreateComic from './CreateComic';
import CreateFlag from './CreateFlag';
import Login from './Login';

class Admin extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user
		 }
	}

	render() {
		return (
			<div className="Admin-container">
				<Router>
				<div className="Admin-header">
				<Link to="/admin/createpost">
					Post
				</Link>
				<Link to="/admin/createuser">
					User
				</Link>
				<Link to="/admin/createcomic">
					Comic
				</Link>
				<Link to="/admin/createflag">
					Flag
				</Link>
				</div>
				<div className="Admin-content">
					<Route path='/admin/createpost' exact render={(props)=><CreatePost {...props} user={this.state.user}/>} />
					<Route path='/admin/createuser' exact render={(props)=><CreateUser {...props} user={this.state.user}/>} />
					<Route path='/admin/createcomic' exact render={(props)=><CreateComic {...props} user={this.state.user}/>} />
					<Route path='/admin/createflag' exact render={(props)=><CreateFlag {...props} user={this.state.user}/>} />
				</div>
				</Router>
			</div>
		);
	}
}

export default Admin;