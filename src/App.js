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
      <center><h2>Session List</h2></center>
      {sessions.map((session) => (
        <div class="card">
          <div class="card-inside">
            <div>Activity: {session.activity}</div>
            <div>Coach: {session.coach}</div>
            <div>Level: {session.level}</div>
            <div>Date start: {session.date_start}</div>
            <div>Duration: {session.duration_minute} min</div>
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
    const weekList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = this.props.weeks[i];
    const day = weekList[moment(this.props.weeks[i].toString()).day()];
    const dateDay = date + " " + day;
    return (
      <Day
        value={dateDay}
        onClick={() => this.props.onClick(i)}
      />
    )
  }
  render() {
    const selectDay = this.props.date;
    return (
      <div className="div-row">
      {this.renderDay(0)}
      {this.renderDay(1)}
      {this.renderDay(2)}
      {this.renderDay(3)}
      {this.renderDay(4)}
      {this.renderDay(5)}
      {this.renderDay(6)}
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weeks: [
        moment().format('YYYY-MM-DD'),
        moment().add(1, 'days').format('YYYY-MM-DD'),
        moment().add(2, 'days').format('YYYY-MM-DD'),
        moment().add(3, 'days').format('YYYY-MM-DD'),
        moment().add(4, 'days').format('YYYY-MM-DD'),
        moment().add(5, 'days').format('YYYY-MM-DD'),
        moment().add(6, 'days').format('YYYY-MM-DD'),
      ],
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
  componentWillUpdate() {
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
    this.setState({
      date: this.state.weeks[i],
    })
    this.render();
  }
  renderCalendar(i) {
    return (
      <Calendar
        weeks={i}
        onClick={i => this.handleSelect(i)}
      />
    )
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Title name={this.props.name}/>
          <Clock />
          {this.renderCalendar(this.state.weeks)}
          <Sessions sessions={this.state.sessions} />
        </div>
      </div>
    )
  };
}


export default App;
