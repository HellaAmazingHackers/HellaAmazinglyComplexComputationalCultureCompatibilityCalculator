import React from 'react';
import ReactDOM from 'react-dom';
import * as s from '../serverCalls.js';


export default class TradeoffTwitter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
    var taClient = new TradeoffAnalytics('ta');
      
    // Start the client
    taClient.start(function(){
      
      console.log('Starting TA Widget...');
      // Upon success, load the problem json...
      // $.getJSON('./twitterProblem.json', function(data) {
      //   // ...and pass it to the client
      //   taClient.show(data);
      // });

      // Make call to our our server API to grab the JSON object from the database
      $.get('/problem', 
        {dataType: 'json'},
        function(data) {
          console.log('got problem obj from server (db): ', data);
          taClient.show(data);
        });

      // subscribe to events
      taClient.subscribe('onError', function (error) {
        console.log('TA Widget Sent Error: ' + error);
      });
      
      taClient.subscribe('doneClicked', function (op) {
        console.log('final decision is ' + op.name);
        window.location.href = `/twitter?username=${op.name}`;
      });
      
      taClient.subscribe('compareClicked', function(ops) {
        console.log('comparing options:' + ops.map(function(op){return op.name;}));
      });
      
      taClient.subscribe('problemResolved', function(dillema) {
        var opOps = dillema.resolution.solutions.filter(function(s){return s.status=='FRONT';});
        console.log('Problem Resolved. '+ opOps.length + ' Top options.' );
      });
      
      var clk = taClient.subscribe('optionClicked', function(op) {
        console.log('Clicked. '+ op.name);
      });

    });
  }

  render () {

    var taStyle = {
      height: "100%"
    }

    const containerStyle = {
      height: '100vh',
      margin: '0',
      overflow: 'hidden'
    }

    return (
      <div style={containerStyle}>
        <div id="ta" style={taStyle} />
      </div>
    );
  }
}