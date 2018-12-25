import React from 'react';
import ReactDOM from 'react-dom'; 
import {injectGlobal} from 'react-emotion';
import axios from 'axios';
import {SlackApp} from './components/slackApp';
import Futura from './fonts/Futura.ttc';

injectGlobal`
  html, body {
    height: 100vh;
    width: 100vw; 
    margin: 0;
    font-size: 20px;
  } 

  #app{
    width: 100vw;
    height: 100vh;
  }

  @font-face {
    font-family: 'Futura';
    src: url(${Futura}) format('truetype');
  }
`;

let refreshTime = 5000;
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      fetched: false,
      channels: [],
      users: [],
      bots: [],
      messages: [],
      selectedUsers: [],
      selectedBots: [],
      selectedChannels: [],
      team: [],
      orientation: 'horizontal',
    };
    this.fetched = this.fetched.bind(this);
  }

  componentDidMount(){
    axios.get('/info')
      .then(res => {
        console.log('info', res.data);
        this.setState({
          fetched: true,  
          orientation: res.data.orientation, 
          channels: res.data.channels,
          users: res.data.users,
          bots: res.data.bots,
          messages: res.data.messages,
          channelName: res.data.channelName,
          selectedUsers: res.data.selectedUsers,
          selectedBots: res.data.selectedBots,
          slackAccessToken: res.data.slackAccessToken,
          team: res.data.team
        }, this.fetched);
      })
    }
     
    fetched(){ 
      setInterval(() => {
        axios.get(`/update`)
        .then(res =>{
          console.log('update', res.data);
          refreshTime = 5000;
          this.setState({
            messages: res.data.messages, 
            typingUsers: res.data.typingUsers
          }); 
        })
      }, refreshTime);
    }

    render(){
      if (!this.state.fetched) return null;

      if (this.state.messages) {
        return (
          <SlackApp 
            users={this.state.users}
            bots={this.state.bots}
            messages={this.state.messages}
            channels={this.state.channels}
            channelName={this.state.channelName}
            teamInfo={this.state.team}
          />
        );
      }

      return <div style={{textAlign: 'center', paddingTop: '10%', fontSize: '35px'}}>Veri alırken hata oluştu.</div>;
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);