import React from 'react';
import ReactDOM from 'react-dom';
import * as s from '../serverCalls.js';


export default class TradeoffResumes extends React.Component {
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
      $.getJSON('./newTest1.json', function(data) {
        // ...and pass it to the client
        taClient.show(data);
      });
        
      // subscribe to events
      taClient.subscribe('onError', function (error) {
        console.log('TA Widget Sent Error: ' + error);
      });
      
      taClient.subscribe('doneClicked', function (op) {
        console.log('final decision is ' + op.name);
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