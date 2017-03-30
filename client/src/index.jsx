import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import About from './components/About.jsx';
import Create from './components/Create.jsx';
import LoginForm from './components/LoginForm.jsx';
import SignupForm from './components/SignupForm.jsx';
import ComparisonChart from './components/ComparisonChart.jsx';
import Analyses from './components/Analyses.jsx';
import Public from './components/Public.jsx';
import UserAnalyses from './components/UserAnalyses.jsx';
import Tradeoff from './components/Tradeoff.jsx';
import TwitterSearch from './components/TwitterSearch.jsx';
import CustomForm from './components/CustomForm.jsx';
import * as s from './serverCalls.js';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';


class App extends React.Component {
  constructor(props) {
    super(props);

    ['toggleSpinner'].forEach((method) => {
      this[method] = this[method].bind(this);
    });

    this.state = {
      spinner: false,
      user: 'Guest',
      loggedIn: false,
    }

  }

  componentDidMount() {
    s.serverGet('checkLoggedIn').then((res) => {
      console.log(res);
      if (res.data === 'logged in') {
        this.setState({
          loggedIn: true
        });
      }
    });
  }

  toggleSpinner() {
    this.setState({
      spinner : !this.state.spinner
    })
  }

  render () {
    var taStyle = {
      height: "100%"
    }

    return (
      <Router>
        <div className="container" style={taStyle}>
          <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <Link to="/Home" className="navbar-brand" >datashrink</Link>
              </div>
              <div id="navbar" className="navbar-collaspe">
                <ul className="nav navbar-nav">
                  <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" 
                    role="button" aria-haspopup="true" aria-expanded="false">new analysis &nbsp;
                      <span className="caret"></span>
                  </a>
                    <ul className="dropdown-menu">
                      <li><a href="\twitter">my twitter</a></li>
                      <li><Link to="/TwitterSearch">public twitter</Link></li>
                      <li><Link to="/CustomForm">custom text</Link></li>
                    </ul> 
                  </li>
                  <li><Link to="/User">saved analyses</Link></li>
                  <li><Link to="/Public">browse analyses</Link></li>
                  <li><Link to="/Tradeoff">search personalities</Link></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                  {!this.state.loggedIn && <li><a href="/AuthLogin">log in</a></li> }
                  {this.state.loggedIn && <li><a href='/AuthLogout'>logout</a></li> }
                <li><div className="credit-photos">
                  powered by: 
                  <img id="footer-images" src={"/images/IBM-Watson-image.png"} />
                  <img id="footer-images" src={"/images/twitterLogo.png"} />
                </div></li>
                </ul>
              </div>
            </div>
          </nav>
          <img id="datashrink" src={"/images/datashrink_360.jpg"} />
          <div className="container" style={taStyle}>
            <h1 className="header">datashrink
              <span>&nbsp;&nbsp;&nbsp;</span>
              {this.state.spinner && <img id="spinner" className="header" src={"/images/spinner.gif"} />}
            </h1>
            <Route path="/Home" component={About}/>
            <Route path="/TwitterSearch" component={() => <TwitterSearch toggleSpinner={this.toggleSpinner} />} />
            <Route path="/CustomForm" component={() => <CustomForm toggleSpinner={this.toggleSpinner}/>}/>
            <Route path="/Public" component={() => <Public toggleSpinner={this.toggleSpinner} />} />          
            <Route path="/User" component={UserAnalyses}/>
            <Route path="/Tradeoff" component={Tradeoff}/>
            <Route path="/analyses/:id" render={(nativeProps) => <Analyses nativeProps={nativeProps} toggleSpinner={this.toggleSpinner} /> } />
          </div>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
