import React, {Component} from 'react';

import {Editor, EditorState, RichUtils} from 'draft-js';

class RichText extends Component {
	constructor(props) {
	    super(props);
	    this.state = {editorState: EditorState.createEmpty()};
	    this.onChange = (editorState) => {
	    	this.setState({editorState})
	    	this.props.onChange(editorState, editorState.getCurrentContent());
	    }
	}

	setHeader = (header) => {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, header));
	}

	setStyle = (style) => {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style));
	}

	render() {
	    return (
	    	<div className="App-rte">
	    	<div className="App-rteButtons">
	    		<button type="button" onClick={()=>this.setHeader("header-one")}>H1</button>
	    		<button type="button" onClick={()=>this.setHeader("header-two")}>H2</button>
	    		<button type="button" onClick={()=>this.setHeader("header-three")}>H3</button>
	    		<button type="button" onClick={()=>this.setStyle("BOLD")}><strong>B</strong></button>
	    		<button type="button" onClick={()=>this.setStyle("ITALIC")}><em>I</em></button>
	    	</div>
	    	<Editor placeholder={this.props.placeholder} editorState={this.state.editorState} onChange={this.onChange} />
	    	</div>
	    )
	}
}

export default RichText;