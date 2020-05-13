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

function getTime(dateStr) {
  return String(dateStr).slice(11, 19);
}

function getTimeZone(dateStr) {
  return String(dateStr).slice(19);
}

function getDate(dateStr) {
  return String(dateStr).slice(0, 10);
}

function getCoach(coachID) {
  const coachAPI = 'https://back.staging.bsport.io/api/v1/coach/' + coachID;
  let coachName;
  fetch(coachAPI)
    .then(res => res.json())
    .then((data) => {
      coachName = data.id;
    })
  return String(coachName);
}


class Sessions extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // coachList: new Map(),
      sessions: this.props.sessions,
      fetchSth: "",
    };
  }

  render() {
      return (
        <div>
          <center><h2>Session List</h2></center>
          <div>{this.state.fetchSth}</div>
          {this.props.sessions.map((session) => (
            <div class="card">
              <div class="card-inside">
                <div>Date: {getDate(session.date_start)}</div>
                <div>Activity: {session.activity}</div>
                <div>Coach: {this.props.coachs.get(session.coach)}</div>
                <div>Level: {session.level}</div>
                <div>Date start: {getTime(session.date_start)} ({getTimeZone(session.date_start)})</div>
                <div>Duration: {session.duration_minute} min</div>
              </div>
            </div>
          ))}
        </div>
      )
  }
}


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
      all_sessions: [],
      sessions: [],
      coachList: new Map(),
    };

    this.doFetch();
  }

  doFetch() {
    let date = this.state.date
    let max_date = moment().add(6, 'days').format('YYYY-MM-DD')
    let all_list = [];

    const myAPI = 'https://back.staging.bsport.io/api/v1/offer/?company=6&min_date=' + date + '&max_date=' + max_date;

    (async ()=>{
      try {
        await fetch(myAPI)
         .then(res => res.json())
         .then((data) => {
           this.setState({
             all_sessions: data.results
           }, () => {
             this.getCoachList();
             this.updateList();
           })
         }).catch(console.log);

      } catch(e) {
        console.log(e);
      }
    })();
  }

  async getCoachList() {
    let id;
    let name;
    let myMap = this.state.coachList;
    let sessions = this.state.all_sessions;

    for (let i=0; i<sessions.length; i++) {
      let session = this.state.all_sessions[i];
      id = session.coach;
      name = String(id);

      let coachAPI = 'https://back.staging.bsport.io/api/v1/coach/' + id;
      await fetch(coachAPI)
        .then((response) => response.json())
        .then(json => {
          name = String(json.user.name);
          myMap.set(id, name);

        }).catch((error)=> {
          console.log(error);
        })

      myMap.set(id, name);
      this.setState({
        coachList: myMap,
      })
    }

  }

  updateList() {
    const today = this.state.date.toString();
    const list = this.state.all_sessions;
    let today_list = [];
    let p = 0;
    for (let k=0; k < list.length; k++ ) {
      if (list[k].date_start.indexOf(today) > -1) {
        today_list[p] = list[k];
        p++;
      }
    }
    this.setState({
      sessions: today_list
    })
  }

  async handleSelect(i) {
    await this.setState({
      date: this.state.weeks[i],
    });
    this.updateList();
  }

  renderCalendar(i) {
    return (
      <div>
      <Calendar
        weeks={i}
        onClick={i => this.handleSelect(i)} />
      </div>
    )
  }
  render() {
    const sessions = this.state.sessions;
    const coachs = this.state.coachList;
    return (
      <div className="App">
        <div className="App-header">
          <Title name={this.props.name}/>
          <Clock />
          {this.renderCalendar(this.state.weeks)}
          <Sessions sessions={sessions} coachs={coachs} />
        </div>
      </div>
    )
  };
}

export default App;
