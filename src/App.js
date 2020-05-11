import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment';


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
    this.state = {
      date: new Date()
    };
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

const Sessions = ({ sessions }) => {
  return (
    <div>
      <center><h1>Session List</h1></center>
      {sessions.map((session) => (
        <div>
          <div>
            <p>Activity: {session.activity}</p>
            <p>Coach: {session.coach}</p>
            <p>Level: {session.level}</p>
            <p>Date start: {session.date_start}</p>
            <p>Duration: {session.duration_minute} min</p>
          </div>
        </div>
      ))}
    </div>
  )
};

class Day extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <button
          className="button day-btn"
          onClick={() => this.props.onClick()}>{this.props.value}</button>
      </div>
    );
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }
  renderDay(i) {
    return (
      <Day
        value={i}
        onClick={() => this.props.onClick()}
      />
    )
  }
  render() {
    const selectDay = this.props.value;
    return (
      <div>
      <div className="div-row">
      {this.renderDay('Monday')}
      {this.renderDay("Tuesday")}
      {this.renderDay("Wednesday")}
      {this.renderDay("Thursday")}
      {this.renderDay("Friday")}
      {this.renderDay("Saturday")}
      {this.renderDay("Sunday")}
      </div>
        <div>{this.props.value}</div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().format('YYYY-MM-DD'),
      sessions: [],
    };
  }

  componentDidMount() {
    const myAPI = 'https://back.staging.bsport.io/api/v1/offer/?company=6&page=4';
    const today = this.state.date.toString();
    fetch(myAPI)
        .then(res => res.json())
        .then((data) => {
          let res = [];
          let p = 0;
          for (let k=0; k< data.results.length; k++) {
            if (data.results[k].date_start.indexOf(today) > -1) {
              res[p] = data.results[k];
              p++;
            }
          }
          this.setState({ sessions: res })
        })
        .catch(console.log);

  }
  handleSelect(i) {
    alert(i);
  }
  renderCalendar(i) {
    return (
      <Calendar
        value={i}
        onClick={() => this.handleSelect(i)}
      />
    )
  }
  render() {
    moment().calendar();
    return (
      <div className="App">
        <div className="App-header">
          <Title name={this.props.name}/>
          <Clock />
          {this.renderCalendar(this.state.date)}
          <Sessions sessions={this.state.sessions} />
        </div>
      </div>
    )
  };
}


export default App;
