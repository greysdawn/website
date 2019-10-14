import React, {Component, Fragment as Frag} from 'react';
import axios from 'axios';

import './Blog.css';

import PostCard from '../Components/PostCard';


class Blog extends Component {
	constructor(props) {
		super(props);

		this.state = {posts: [], page: 0};
	}

	async componentDidMount() {
		var dat = await axios('/api/posts');
		this.setState({posts: dat.data})
	}

	setPage(num) {
		this.setState({page: num});
	}

	render() {
		var posts = this.state.posts || [];
		var page = this.state.page;
		return (
			<div className="App-container">
				<section className="App-top">
	              <h1>The <span className="App-light">Blog</span></h1>
	              <p>How-Tos and other information</p>
	       		 </section>
	        	<section className="Blog-list">
					{posts.slice(10*page, 10*page+10).map((c,i) => {
						return (
							<PostCard key={i} delay={i} post={c}/>
						);
					})}
				</section>
			</div>
		);
	}
}

export default Blog;