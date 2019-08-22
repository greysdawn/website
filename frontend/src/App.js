import React, { Component, Fragment as Frag } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {Helmet} from 'react-helmet';
import './App.css';

import Home     from './Pages/Home';
import Contact  from './Pages/Contact';
import Project  from './Pages/Project';
import System   from './Pages/System';
import Blog     from './Pages/Blog';
import Post     from './Pages/Post';
import Admin    from './Pages/Admin';

class App extends Component {
  constructor() {
    super();
    this.state = {projects: undefined, sysid: undefined, contacts: undefined, login: {name: undefined, pass: undefined}, user: undefined};
  }
  async componentDidMount() {
    var projects = await fetch('/api/projects');
    projects = await projects.json();
    var sysid = await fetch('/api/sysid');
    sysid = await sysid.json();
    var contacts = await fetch('/api/contacts');
    contacts = await contacts.json();
    var user = await fetch('/api/user');
    try {
      user = await user.json()
    } catch(e) {
      user = undefined;
    }
    this.setState({projects: projects, sysid: sysid.id, contacts: contacts, user: user});
  }

  handleChange = (name, e) => {
    const n = name;
    const val = e.target.value;
    this.setState((state) => {
      state.login[n] = val;
      return state;
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    var st = this.state.login;

    var res = await fetch('/api/login', {
      method: "POST",
      body: JSON.stringify(st),
      headers: {
        "Content-Type": "application/json"
      }
    });


    if(res.status == 200) {
      res = await fetch('/api/user');
      this.setState({submitted: true, user: await res.json()})
    } else {
      this.setState({submitted: false});
    }
  }

  render() {
    var links = ["home","contact","system","blog"];
    if(!this.state.projects) {
      return null;
    } else {
      return (
        <div className="App">
          <header className="App-header">
            <p>grey skies</p>
            <ul>
            {links.map((v,i)=>{
              return (
                <li key={i}
                    style={{animationDelay: (.5*i)+"s"}}
                >
                  <a href={`/${v == "home" ? "" : v}`}>{v}</a>
                </li>
              );
            })}
            </ul>
          </header>
          <Router>
            <Route path="/" exact render={(props)=><Home {...props} list={this.state.projects} />}/>
            <Route path="/contact" render={(props)=><Contact {...props} list={this.state.contacts} />}/>
            <Route path="/system" render={(props)=><System {...props} id={this.state.sysid} />} />
            <Route path="/blog" exact render={(props)=><Blog {...props} />} />
            <Route path="/blog/post/:id" exact render={(props)=><Post {...props}/>} />
            {
              this.state.user ?
              <Route path="/admin" render={(props)=> <Admin {...props} user={this.state.user} />} /> :
              <Route path="/admin" render={(props)=> 
                <Frag>
                  <form onSubmit={this.handleSubmit} className="Admin-form">
                    <label>
                    Name:{" "}
                    <input type="text" onChange={(e)=>this.handleChange("name",e)} name="name" value={this.state.name}/>
                    </label>
                    <br/>
                    <label>
                    Pass:{" "}
                    <input type="text" onChange={(e)=>this.handleChange("pass",e)} name="pass" value={this.state.pass}/>
                    </label>
                    <br/>
                    <button type="submit">Submit</button>
                  </form>
                </Frag>
              }
              />
            }
            <Route path="/project/:id" render={(props)=><Project {...props} project={this.state.projects.find(p => p.id == props.match.params.id)}/>} />
          </Router>
          <footer>
            © the grey skies 2019
          </footer>
        </div>
      );
    }
  }
}

export default App;