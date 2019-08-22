import React, {Component, Fragment as Frag} from 'react';
import * as fetch from 'node-fetch';

import './Post.css';

class Post extends Component {
	constructor(props) {
		super(props);

		this.state = {postid: this.props.match.params.id};
	}

	async componentDidMount() {
		var dat = await fetch('/api/post/'+this.state.postid);
		this.setState({post: await dat.json()})
	}

	render() {
		var post = this.state.post || [];
		var dt = new Date(post.timestamp);
		console.log(dt);
		if(post.user) {
			return (
				<div className="App-container">
					<section className={"App-top"+(post.cover_url ? " PostPage-header" : "")} style={{backgroundImage: `${post.cover_url ? "url("+post.cover_url+")" : ""}`}}>
		              <h1>{post.title}</h1>
		              <p style={{lineHeight: "32px"}}>Posted by <img src={post.user.avatar_url} alt={post.user.name+"'s avatar"} style={{height: "32px", width: "32px", borderRadius: "50%", verticalAlign: "middle"}} /> {post.user.name} on{" "}
		              {`${(dt.getMonth()+1) < 10 ? "0"+(dt.getMonth()+1) : (dt.getMonth()+1)}.${(dt.getDate()) < 10 ? "0"+(dt.getDate()) : (dt.getDate())}.${dt.getFullYear()}`} at {`${(dt.getHours()) < 10 ? "0"+(dt.getHours()) : (dt.getHours())}:${(dt.getMinutes()) < 10 ? "0"+(dt.getMinutes()) : (dt.getMinutes())}`}
		              </p>
		            </section>
		        	<section className="PostPage-content">
						<div dangerouslySetInnerHTML={{__html: post.body}}>
						</div>
					</section>
				</div>
			);
		} else {
			return(
				<p>Loading...</p>
			);
		}
	}
}

export default Post;