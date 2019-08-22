import React, { Component } from 'react';
import showdown from 'showdown';
import sanitize from 'sanitize-html';

showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('simpleLineBreaks', true);
showdown.setOption('openLinksInNewWindow', true);
showdown.setOption('underline', true);
showdown.setOption('strikethrough', true);

var conv = new showdown.Converter();

class MemberCard extends Component {
	constructor(props) {
		super(props);

		this.props.member.tmpdescription = sanitize(conv.makeHtml(this.props.member.description),
		{
			allowedTags: [
				'em',
				'strong',
				'i',
				'b',
				'del',
				'u',
				'p',
				'a',
				'code',
				'pre',
				'br',
				'blockquote'
			]
		});

		this.state = {
			key: 	this.props.key,
			member: this.props.member  
		}
	}

	render() {
		var memb = this.state.member
		console.log(memb.color);
		if(memb) {
			return (
				<div
					className="App-listitem App-memberCard"
					style={{animationDelay: (this.state.key*.25)+"s","animationDuration":".25s"}}>
				<h1>
					{memb.name.toUpperCase()}
				</h1>
				<img className="App-avatar" style={{boxShadow: "0 0 0 5px #"+(memb.color ? memb.color : "aaa")}} src={memb.avatar_url || "/default.png"} alt={memb.name + "'s avatar"}/>
				<span className="App-tagline">{memb.prefix}</span>
				<span className="App-tagline">{memb.pronouns || "(N/A)"} || {memb.birthday || "(N/A)"}</span>
				<div className="App-description" dangerouslySetInnerHTML={{__html: memb.tmpdescription || "<p>(no description)</p>"}}></div>
				</div>
			);
		} else {
			return null;
		}
	}
}

export default MemberCard;