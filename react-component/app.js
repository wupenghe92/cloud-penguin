import React, { Component } from 'react'
import { render } from 'react-dom'

const POLL_INTERVAL = 2000;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      str: 'Kimi is sleeping',
      friendList: [],
      status: {},
      prevstate: {}
    }
    this.getData = this.getData.bind(this);
    this.parseData = this.parseData.bind(this);
    this.updatePrevState = this.updatePrevState.bind(this);
    this.compareState = this.compareState.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log(nextState.status);
    if (this.compareState(nextState)) {  //true means prevs state and nextState are the same
      return false;
    }
    this.updatePrevState(nextState);
    return true;
  }

  compareState(nextState) {
    const prevstate = this.state.prevstate;
    // const nextState = this.state;
    if (!(nextState.status.happiness   === prevstate.happiness)    ||
        !(nextState.status.hunger      === prevstate.hunger)       ||
        !(nextState.status.busy        === prevstate.busy)         ||
        !(nextState.status.playingWith === prevstate.playingWith))
    {
      return false;
    }
    if (!prevstate.friendList || prevstate.friendList.length !== nextState.friendList.length) return false;
    for (let i=0; i<nextState.friendList.length; i++) {
      if (prevstate.friendList[i].username     !== nextState.friendList[i].username ||
          prevstate.friendList[i].friendliness !== nextState.friendList[i].friendliness)
      {
        return false;
      }
    }
    return true;
  }

  updatePrevState(nextState) {
    const prevstate = this.state.prevstate;
    // const nextState = this.state;
    prevstate.happiness   = nextState.status.happiness;
    prevstate.hunger      = nextState.status.hunger;
    prevstate.busy        = nextState.status.busy;
    prevstate.playingWith = nextState.status.playingWith;
    prevstate.friendList = [];
    for (let i=0; i<nextState.friendList.length; i++) {
      prevstate.friendList[i] = {};
      prevstate.friendList[i].username     = nextState.friendList[i].username;
      prevstate.friendList[i].friendliness = nextState.friendList[i].friendliness;
    }
  }

  componentWillMount() {
    this.getData();
  }

  parseData(data) {
    // console.log('parseData',data);
    this.state.friendList = data.friendList;
    this.state.status = data.kimi;
    if (data.kimi.busy) {
      this.state.str = `Kimi is playing with ${data.kimi.playingWith}`;
    } else {
      this.state.str = 'Kimi is sleeping';
    }

    this.setState({
      str: this.state.str,
      friendList: this.state.friendList,
      status: this.state.status
    });
  }

  getData() {
    const appClass = this;
    const url = 'http://localhost:3000/kimi/info';
    // const url = 'http://10.9.9.21:3000/kimi/info';
    $.get(url, (data) => {
      // console.log('data',data);
      appClass.parseData(data);
    },'json');
    setTimeout(this.getData.bind(this), POLL_INTERVAL);
  }

  render() {
    console.log('render');
    const image = <img id='kimiImg' src={"./kimi/kimi.jpg"} alt="kimi"></img> ;
    return (
      <div>
        <PlayingWith str={this.state.str}/>
        <div className="row">
          <div className="column-l" id='friendList'>
            <FriendList friendList={this.state.friendList}/>
          </div>
          <div className="column-m">
            {image}
          </div>
          <div className="column-r" id='kimiStatus'>
            <KimiStatus status={this.state.status}/>
          </div>
        </div>
      </div>
    )
  }
}



class PlayingWith extends Component {
  render() {
    // console.log('render1');
    return (
      <h3>{this.props.str}</h3>
    )
  }
}

class FriendList extends Component {
  render() {
    // console.log('render2');
    const list = [];
    for (let i=0; i<this.props.friendList.length; i++) {  //this.props.friendList.length
      list.push(
        <li key={`list${i}`}>{`${this.props.friendList[i].username}     ${this.props.friendList[i].friendliness}`}</li>
      )
    }
    return (
      <div>
        <p>Friends List</p>
        <ol>{list}</ol>
      </div>
    )
  }
}

class KimiStatus extends Component {
  render() {
    // console.log('render3');
    return (
      <div>
        <ul>{`happiness:  ${this.props.status.happiness}`}</ul>
        <ul>{`hunger:     ${this.props.status.hunger}`}</ul>
      </div>
    )
  }
}


render(
  <App />,
  document.getElementById('reactComponent')
);
