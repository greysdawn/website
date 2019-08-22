import React, {Component, Fragment as Frag} from 'react';

import './PostCard.css';


class PostCard extends Component {
	constructor(props) {
		super(props);
		this.state = {post: this.props.post, delay: this.props.delay};
	}

	render() {
		var post = this.state.post || {};
		var dt = new Date(this.state.post.timestamp);
		return (
			<a
				className="Post-container"
				href={"/blog/post/"+post.id}
				target="__blank"
				style={{animationDelay: (this.state.delay*.125)+"s"}}
				>
				<div className="Post-cover" style={{backgroundImage: `${post.cover_url ? "url("+post.cover_url+")" : ""}`}}>
					<div className="Post-user">
						<img className="Post-icon" src={post.user.avatar_url} alt={post.user.name + "'s avatar"}/>
						<p>{post.user.name}
						<br/><span style={{fontSize: "15px", lineHeight: "15px"}}>{`${(dt.getMonth()+1) < 10 ? "0"+(dt.getMonth()+1) : (dt.getMonth()+1)}.${(dt.getDate()) < 10 ? "0"+(dt.getDate()) : (dt.getDate())}.${dt.getFullYear()}`} at {`${(dt.getHours()) < 10 ? "0"+(dt.getHours()) : (dt.getHours())}:${(dt.getMinutes()) < 10 ? "0"+(dt.getMinutes()) : (dt.getMinutes())}`}</span>
						</p>
					</div>
				</div>
				<div className="Post-content" style={{height: "100%"}}>
					<h1 style={{fontWeight: "bold", margin: "0", paddingTop: "10px", lineHeight: '1.5em'}}>{post.title}</h1>
					<div className="Post-fade"><p>{post.short}</p></div>
				</div>
			</a>
		);
	}
}

export default PostCard;