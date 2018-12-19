import React from 'react';
import ReactDOM from 'react-dom'; 
import {css, injectGlobal} from 'react-emotion';
import axios from 'axios'; 
import {SlackApp} from './components/slackApp';
// import Futura from './fonts/Futura.ttc';
import Futura from './fonts/Futura.ttc'; 
import { buildMessagesObject } from './components/elements'; 

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

const appStyle= css`
  width: 100%;
  height: 100%;
  background: red;
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
    // this.fetched = this.fetched.bind(this);
  }

  componentDidMount(){
    axios.get('/info')
      .then(res => {   
        console.log(res.data.messages); 
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

        }, () => this.fetched());
      })
    }
     
    fetched(){ 
      setInterval(() => {
        axios.get(`/update`)
        .then(res =>{
          console.log(res.data.messages);
          if(res.data.websocketConnectionStatus){
            refreshTime = 1000;
          }else{
            refreshTime = 5000;
          } 
          this.setState({
            messages: res.data.messages, 
            typingUsers: res.data.typingUsers
          }); 
        })
      },refreshTime); 
    }

    render(){
      if(!this.state.fetched) return null;  
      if(this.state.messages){ 
        return(  
          <SlackApp 
              users={this.state.users} 
              bots={this.state.bots}  
              messages={this.state.messages}
              channels={this.state.channels}
              channelName={this.state.channelName} 
              teamInfo={this.state.team}
          />
        )
      }else{
        return(
          <div style={{textAlign: 'center', paddingTop: '10%', fontSize: '35px'}}>Veri alırken hata oluştu.</div>
        )
      }
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);