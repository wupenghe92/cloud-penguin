import React, { Component } from 'react'
import { render } from 'react-dom'

const POLL_INTERVAL = 2000;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      str: 'Kimi is sleeping',
      friendList: [],
      status: {}
    }
    this.getData = this.getData.bind(this);
    this.parseData = this.parseData.bind(this);
  }

  componentWillMount() {  //componentWillMount
    this.getData();
  }

  parseData(data) {
    console.log('parseData',data);
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
    return (
      <h3>{this.props.str}</h3>
    )
  }
}

class FriendList extends Component {
  render() {
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
    return (
      <div>
        <ul>{`happiness:  ${this.props.status.happiness}`}</ul>
        <ul>{`hunger:     ${this.props.status.hunger}`}</ul>
      </div>
    )
  }
}


const imgStyles = {
  width: '80%',
  height: '58%'
}


render(
  <App />,
  document.getElementById('reactComponent')
);
