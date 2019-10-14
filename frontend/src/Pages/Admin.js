import React, {Component, Fragment as Frag} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './Admin.css';

import CreatePost from '../Components/CreatePost';
import CreateUser from '../Components/CreateUser';
import CreateComic from '../Components/CreateComic';
import Login from '../Components/Login';

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
				<div className="Admin-sidebar">
				<a className="Admin-sideItem" href="/admin/createpost">
					Create Post
				</a>
				<a className="Admin-sideItem" href="/admin/createuser">
					Create User
				</a>
				<a className="Admin-sideItem" href="/admin/createcomic">
					Create Comic
				</a>
				</div>
				<div className="Admin-content">
					<Router>
						<Route path='/admin/createpost' exact render={(props)=><CreatePost {...props} user={this.state.user}/>} />
						<Route path='/admin/createuser' exact render={(props)=><CreateUser {...props} user={this.state.user}/>} />
						<Route path='/admin/createcomic' exact render={(props)=><CreateComic {...props} user={this.state.user}/>} />
					</Router>
				</div>
			</div>
		);
	}
}

export default Admin;