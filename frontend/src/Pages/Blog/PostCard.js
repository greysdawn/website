import React, {Component, Fragment as Frag} from 'react';

import './PostCard.css';

function pad(num) {
	num = num.toString();
	return num.length < 2 ? '0' + num : num;
}
function format(dt) {
	return (
		`${pad(dt.getMonth() + 1)}` +
		`.${pad(dt.getDate())}` +
		`.${dt.getFullYear()}` +
		` at ${pad(dt.getHours())}` +
		`:${pad(dt.getMinutes())}`
	);
}


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
				href={"/blog/post/"+post.hid}
				target="__blank"
				style={{animationDelay: (this.state.delay*.125)+"s"}}
				>
				<div className="Post-cover" style={{backgroundImage: `url(${post.cover_url || 'https://cdn.discordapp.com/attachments/481322557925228544/794013126067879936/1609278701224.png'})`}} />
				<div className="Post-user">
					<img className="Post-icon" src={post.user.avatar_url} alt={post.user.name + "'s avatar"}/>
					<p>
						{post.user.name}
						<br/>
						{format(dt)}
					</p>
				</div>
				<div className="Post-content" style={{height: "100%"}}>
					<h1 style={{fontWeight: "bold", margin: "0 5px", lineHeight: '1.5em'}}>{post.title}</h1>
					<div className="Post-fade"><p>{post.short}</p></div>
				</div>
			</a>
		);
	}
}

export default PostCard;