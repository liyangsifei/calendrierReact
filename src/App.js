import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Company #6'
    }
  }
  render() {
    return <h1> Calendar of {this.state.name}</h1>
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div>
        <p> Current Time: {this.state.date.toString()}.</p>
      </div>
    )
  }
}

class Session extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>Session{this.props.value}</div>
    )
  }
}
class Day extends React.Component {
  constructor(props) {
    super(props)
  }
  renderSession(i) {
    return (
      <Session
        value={i}
      />
    )
  }
  render() {
    return (
      <div>
        <div>{this.props.value}</div>
        {this.renderSession(0)}
      </div>
    );
  }
}

class Week extends React.Component {
  constructor(props) {
    super(props);
  }
  renderDay(i) {
    return (
      <Day
        value={i}
      />
    )
  }
  render() {
    return (
      <div className="div-row">
        {this.renderDay('Monday')}
        {this.renderDay("Tuesday")}
        {this.renderDay("Wednesday")}
        {this.renderDay("Thursday")}
        {this.renderDay("Friday")}
        {this.renderDay("Saturday")}
        {this.renderDay("Sunday")}
      </div>
    )
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);


  }
  renderWeek(i) {
    return (
      <Week
        value={i}
      />
    )
  }

  render() {
    return (
      <div>
        {this.renderWeek('Hi')}
        <div></div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    let st = 0;
    let resp = [];

    this.state = {
      st: st,
      err: "start",
      resp: resp,
      ind: 0,
    };
  }

  doFetch() {
    const myInit = {
      method: 'GET',
      dataType: 'json',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    };
    const myAPI = 'https://back.staging.bsport.io/api/v1/offer/?company=6&page=4';

    const myRequest = new Request(myAPI, myInit);
    let s = 0;
    let resp;
    let e;

    fetch(myRequest).then((response) => {
      s = 1;
      if (response.ok) {
        s = 1;
        return response.json();
      } else {
        return "error";
      }
    }).then(response => {
      resp = response;
    }).catch(function(err) {
      e = err;
    })
    ;

    this.setState({
      st: s,
      resp: resp,
      err: e,
    });


  }


  render() {
    if(this.state.ind == 0) {
      this.doFetch();
      this.setState({
        ind: 1,
      });
    }

    return (
      <div className="App">
        <div className="App-header">
          <Title name={this.props.name}/>
          <Clock />
          <Calendar />
          <div>{this.state.resp}</div>
          <div>{this.state.st}</div>
          <div>{this.state.err}</div>
        </div>
      </div>
    )
  };
}


export default App;
