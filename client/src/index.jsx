import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import About from './components/About.jsx';
import Create from './components/Create.jsx';
import LoginForm from './components/LoginForm.jsx';
import SignupForm from './components/SignupForm.jsx';
import ComparisonChart from './components/ComparisonChart.jsx'
import Analyses from './components/Analyses.jsx'
import Public from './components/Public.jsx'
import UserAnalyses from './components/UserAnalyses.jsx'
import Tradeoff from './components/Tradeoff.jsx'
import TwitterSearch from './components/TwitterSearch.jsx'
import CustomForm from './components/CustomForm.jsx'
import * as s from './serverCalls.js'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      user: 'Guest',
      loggedIn: false,
    }
    this.updateLoggedIn = this.updateLoggedIn.bind(this);
    this.toggleSpinner = this.toggleSpinner.bind(this);
  }

  componentWillMount() {
    s.serverGet('session').then((e) => {
      if (e.data.username) {
        this.setState({
          user: e.data.username,
          loggedIn: true
        })
      }
    });
  }

  toggleSpinner() {
    this.setState({
      spinner : !this.state.spinner
    })
  }

  //the Create style is for illustrative purposes
    //to pass in props:
    // <Route path="/Create" render={() => <Create {...this.state} /> } />
  updateLoggedIn(username) {
    username = username;
    this.setState({
      user: username,
      loggedIn: true
    });
  }


// =======
//             {!this.state.loggedIn && <Route path="/LoginForm" render={() => <LoginForm update={this.updateLoggedIn} />} />}
//             {!this.state.loggedIn && <Route path="/SignUpForm" render={() => <SignupForm update={this.updateLoggedIn} />} />}
//             <Route path="/Create" render={() => <Create ownTwitter={true} {...this.state} toggleSpinner={this.toggleSpinner} /> } />
//             <Route path="/Public" render={() => <Public toggleSpinner={this.toggleSpinner} /> }/>          
// >>>>>>> implemented spinner


  render () {

    return (
      <Router>
        <div className="container">
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
                  {!this.state.loggedIn && <li><Link to="/LoginForm">log in</Link></li> }
                  {!this.state.loggedIn && <li><Link to="/SignUpForm">sign up</Link></li> }
                  {this.state.loggedIn && <li><a href='\logout'>logout</a></li> }
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
          <div className="container">
            <h1 className="header">datashrink
              <span>&nbsp;&nbsp;&nbsp;</span>
              {this.state.spinner && <img id="spinner" className="header" src={"/images/spinner.gif"} />}
            </h1>
            <Route path="/Home" component={About}/>
            {!this.state.loggedIn && <Route path="/LoginForm" component={() => <LoginForm update={this.updateLoggedIn} />} />}
            {!this.state.loggedIn && <Route path="/SignUpForm" component={() => <SignupForm update={this.updateLoggedIn} />} />}
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

//need to fix how far down the current analysis goes down
//left justified
//logo on the upper right of the page

 // <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                //   <span className="sr-only">Toggle Navigation</span>
                //   <span className="icon-bar"></span>
                //   <span className="icon-bar"></span>
                //   <span className="icon-bar"></span>
                // </button>
            // Datashrink interacts with Watson and Twitter to give you an in-depth personality analysis of yourself. 
            // Datashrink operates by obtainnig all of a user's tweets from Twitter, these tweets are sent to Watson 
            // which does an in-depth personality analysis, which is displayed to you in a histogram.  
          // <footer id="footer" className="panel-footer">
           
          // </footer>