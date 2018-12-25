import React from 'react';
import {css} from 'react-emotion';
import slackIcon from './../images/slackLogo.png';
import { Attachment } from './attachment';
import { Reaction, prepareText } from './elements';
import dateFns from 'date-fns';

const Separator = (props) => {
  return (
    <div className={separatorStyle}>
      <div/>
      <span>{props.day}</span>
    </div>
  );
};

const MessageFile = (props) => {
  if (!props.files) return null;
  return(
    <div>
      {props.files.map(file => {
        if (file.mimetype.includes('text')){
          const previews  = file.preview.split('\n');
          return <div  className={textFileStyle} key={file.timestamp}>
                    <span id="title">{file.title}</span>
                    <div id="preview-container">
                      <div id="preview-numbers">{previews.map((p, index) => <p style={{padding: '2px 0'}} key={p+index}>{index+1}</p>)}</div>
                      <div id="preview-messages">{previews.map((preview, i) => <span style={{padding: '2px 0'}} key={preview+i+1}>{preview}</span>)}</div>
                    </div>
                  </div>
        } else if (file.mimetype.includes('image')){
          return <div className={textImageStyle} key={file.timestamp} > 
                    <span id="title">{file.title}</span>
                    <img id="image" src={file.thumb_720} />
                 </div>
        } else if (file.mimetype.includes('application')){
          let link;
          if (file.filetype.includes('xls')){
            link = "https://i0.wp.com/taxpress.gr/wp-content/uploads/2017/05/Excel-Icon.png?fit=215%2C236";
          } else if (file.filetype.includes('pdf')){
            link = `https://png.pngtree.com/svg/20170509/i_pdf_356308.png`;
          } else if (file.filetype.includes('docx')){
            link = 'https://banner2.kisspng.com/20180410/ike/kisspng-microsoft-word-doc-microsoft-office-2013-sas-5acc745685cf03.2378499615233485665481.jpg';
          } else {
            link = 'https://cdn.icon-icons.com/icons2/494/PNG/512/file-empty_icon-icons.com_48300.png';
          }
          return <div key={file.timestamp} style={{width: '100', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '7px 0', 
          border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px' }}>
            <img src={link} style={{width: '55px'}}/> 
            <span style={{fontSize: '1em', fontWeight: 'bold', marginLeft: '8px'}}>{file.name}</span>
          </div>
        }
      })}
    </div>
  )
};

const textImageStyle = css` 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  #title{
    font-size: 0.7em;
    color: gray;
    padding: 8px 0 4px 0;
  }
  #image{
    max-width: 400px;
    max-height: 400px;
    border-radius: 5px; 
  }
`;

const textFileStyle = css` 
  position: relative;  
  #title{
    font-size: 0.8em;
    color: gray;
  }
  &::after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 0.8));
  }
  #preview-container{
    display: flex;
    width: calc(83vw - 174px);
    border-radius: 5px;
    border: 1px solid lightgray;
    margin-top: 5px;
    font-size: 0.8em;
    color: gray;
  }
  #preview-numbers{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(100, 100, 100, 0.2);
    border-radius: 5px 0 0 5px;
    padding: 0 10px 0 20px ;
  }
  #preview-messages{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0.4) 100%);
    border-radius: 0 5px 5px 0;
    padding: 5px 5px 5px 10px;
  }
`;

const Message = (props) => { 
  let user = props.users.find(user => user.id == props.message.user); 
  return (
    <div className={messageStyle}>
      <div className={userPicture} style={{backgroundImage: `url(${user.profile.image_72})` }}/>
      <div style={{background: 'white', boxShadow: '0 0 25px rgba(0, 0, 0, 0.1)', padding: '7px 10px', borderRadius: '5px'}}> 
        <div className={userInfo}> 
          <span id="user-name">{user.profile.real_name}</span>
          <span id="time" >{props.message.messageTime}</span>
        </div>
        <div className={userMessage}>
          {props.message.texts.map(text =>  {
            return prepareText(text, props.users, props.channels);
          })}
          {props.message.attachments && props.message.attachments.map(attachment =>{
            return <Attachment key={attachment.id} attachment={attachment}/>
          })}
          {props.message.files &&  <MessageFile files={props.message.files} /> }
          {props.message.reactions && <Reaction reactions={props.message.reactions} /> } 
        </div>
      </div>
    </div>
  );
};

const BotAddMessage = (props) => {
  if (!props.message.bot) props.message.bot = props.message.bot_id;
  const user = props.users.find(user => props.message.user == user.id);
  const bot = props.bots.find(currentBot => props.message.bot == currentBot.id); 
  const botNameStart = props.message.text.indexOf('<http');
  const botNameEnd = props.message.text.indexOf('>', botNameStart);
  let html = props.message.text.replace(props.message.text.slice(botNameStart, botNameEnd+1), '');
  html += `<span style="color: dodgerblue">  ${bot.name}</span>`;

  function createMarkup() {
    return {__html: html};
  }

  return (
    <div className={messageStyle}>
      <div className={userPicture} style={{backgroundImage: `url(${user.profile.image_72})` }}/>
      <div>
        <div className={userInfo}> 
          <span id="user-name">{user.profile.real_name}</span>
          <span id="time" >{props.message.messageTime}</span>
        </div>
        <div className={userMessage}> 
          <div style={{color: 'gray'}} dangerouslySetInnerHTML={createMarkup()} />
        </div>
      </div>
    </div>
  );
};

const BotMessage = (props) => {   
  const bot = props.bots.find(bot => bot.id == props.bot); 
  let imageStyle;
  if (bot.icons){
    if (bot.icons.image_72){
      imageStyle = {backgroundImage: `url(${bot.icons.image_72})`}
    } else if (bot.icons.image_48){
      imageStyle = {backgroundImage: `url(${bot.icons.image_48})`}
    } else if (bot.icons.image_36){
      imageStyle = {backgroundImage: `url(${bot.icons.image_36})`}
    }
  }
  return (
    <div className={botMessageStyle}>
     <div className={userPicture} style={imageStyle}/> 
      <div id="bot-message-container">
        <div id="bot-info-container">
          <span id="user-name">{bot.name}</span>
          <span id="bot-tag">APP</span>
          <span id="time">{props.messageTime}</span>
        </div>
        <div id="attachment-container">
          <span>{props.text}</span>
          {props.attachments && props.attachments.map(attachment =>{
            return <Attachment key={Math.random()*5141232} attachment={attachment} users={props.users} channels={props.channels}/>
          })}
         </div>
       </div>  
     </div>
  );
};

const JoinedMember = props => {
  const user = props.users.find(user => user.id == props.message.user);
  return (
    <div className={messageStyle}>
      <div className={userPicture} style={{backgroundImage: `url(${user.profile.image_72})` }}/>
      <div>
        <div className={userInfo}> 
          <span id="user-name">{user.profile.real_name}</span>
          <span id="time" >{props.message.time}</span>
        </div>
        <div className={userMessage}>
          <span style={{color: 'gray', fontSize: '0.9em'}}>Joined channel</span>
        </div>
      </div>
    </div>
  );
};

export class SlackApp extends React.Component {
  render(){
	  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = dateFns.addHours(new Date(), 3);
    const time = dateFns.format(date, 'HH:mm');
    let teamImage;
    if (this.props.teamInfo.icon.image_230){
      teamImage = this.props.teamInfo.icon.image_230;
    } else if (this.props.teamInfo.icon.image_132){
      teamImage = this.props.teamInfo.icon.image_132;
    } else {
      teamImage = this.props.teamInfo.icon.image_original;
    }
    return (
      <div className={appStyle}> 
        <div className={leftPanel}>
          <div className={dateContainer}>
            <span style={{fontSize: '4em', fontFamily: 'Futura'}}>{time}</span>
            <span style={{fontSize: '1.2em', fontFamily: 'Futura'}}>{days[date.getDay()]}</span>
          </div>
          <div className={iconContainer}>
            <img src={teamImage}/>
            <span style={{fontFamily: 'Futura', fontSize: '1.2em'}}>{this.props.teamInfo.name}</span> 
          </div>
          <div className={channelsContainer}>
            <span># <span style={{fontFamily: 'Futura', fontSize: '1.1em'}}>{this.props.channelName}</span></span>
          </div>
          <div className={typingUsersContainer}>
          </div> 
          <div style={{position: 'absolute', left: '15px', bottom: '15px'}}>
            <img style={{width: '50px', height: 'auto'}} src={slackIcon} />
          </div>
        </div>
        <div className={messagePanel}>
          <div/>
          <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          {this.props.messages.map((message)=>{
            let separator;
            if (message.messageDay){
              separator = <Separator day={message.messageDay}/>
            }
            if (!message.subtype){
              return (
                <div key={message.key}>
                  {separator}
                  <Message message={message} users={this.props.users} channels={this.props.channels}/>
                </div>
              );
            }
            if (message.subtype === 'bot_add' || message.subtype === 'bot_remove'){
              return (
                <div key={message.key}>
                  {separator}
                  <BotAddMessage message={message} users={this.props.users} bots={this.props.bots}/>
                </div>
              );
            }
            if (message.subtype === 'bot_message'){
              return (
                <div key={message.key} >
                  {separator}
                  <BotMessage bot={message.bot} messageTime={message.messageTime} text={message.text}
                    bots={this.props.bots} users={this.props.users} channels={this.props.channels} attachments={message.attachments} />
                </div>
              );
            }
            return (
              <div key={message.key}>
                {separator}
                <JoinedMember message={message} users={this.props.users}/>
              </div>
            );
          })}
          </div>
        </div>     
      </div>
    );
  }
}

const appStyle = css`
  height: 100%;  
  display: grid;
  grid-template-columns: 17% 83%; 
  justify-content: center;
  align-items: center;
  background: white;
  & * {
    color: black;
    margin: 0;
    font-family: sans-serif;
    box-sizing: border-box;
  }
  `;
  
const leftPanel = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  padding-top: 30px;
  box-shadow: 0 5px 25px 10px rgba(0, 0, 0, 0.1); 
  background-size: cover;
  background: rgba(255, 255, 255, 0.7) center;
`;

const dateContainer = css`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  margin-left: 10%;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
  border-radius: 5px; 
`;
  
const iconContainer = css`
  display: flex;
  justify-content: flex-start;
  align-items: center; 
  margin: 15% 0;
  font-size: 20px;
  padding-left: 10%; 
  img{
    height: 64px;
  }
`;

const channelsContainer = css` 
  font-size: 1.1em;
  padding-left: 10%;
`;

const typingUsersContainer = css`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  #user-container{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 0 15px;
    margin-bottom: 10px;
  }
  #user-image{
    height: 100%;
    width: 40px;
    background: limegreen;
    border-radius: 5px;
  }
  #typing-message{ 
    padding-left: 10px;
  }
`;

const messagePanel = css`
  display: flex;
  align-items: flex-end;
  padding: 0 50px;
  overflow: hidden;
  height: 100vh;
  transition: all 0.3s;
  background: linear-gradient(to right bottom, rgba(76, 175, 80, 0.07), rgba(255, 193, 7, 0.07), rgba(33, 150, 243, 0.07), rgba(236, 64, 122, 0.07));
`;
  
const messageStyle = css`
  width: 100%;
  display: grid;
  grid-template-columns: 64px auto;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 25px;
`;

const botMessageStyle = css`
  display: grid;
  grid-template-columns: 64px auto;
  justify-content: flex-start;
  align-items: flex-start;   
  margin-bottom: 20px;
  #bot-message-container{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;   
    background: white;
    padding: 7px 10px;
    border-radius: 5px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
  }
  #bot-info-container{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  #user-name{
    font-weight: bold;
  }
  #bot-tag{
    background: lightgray;
    color: gray;
    padding: 2px;
    font-size: 0.6em;
    margin-left: 7px;
  }
  #time{
    font-size: 0.75em;
    margin-left: 7px;
    color: gray;
  }
`;

const userPicture = css`
  width: 50px;
  height: 50px;
  background-repeat: no-repeat; 
  background-size: cover;
  border-radius: 5px;
`;

const userInfo = css`
  margin-bottom: 10px;
  #user-name{
    font-size: 1.2em; 
    font-family: 'Futura', sans-serif;  
  }
  #time{
    margin-left: 10px;
    font-size: 0.75em;
  }
`;

const userMessage = css`
  display: flex;
  flex-direction: column;
`;

const separatorStyle = css`
  width: 100%; 
  display: grid;
  grid-template-columns: 1fr auto;
  justify-content: center;
  align-items: center; 
  margin: 0 0 20px 0;
  div{
    height: 1px;
    background: linear-gradient(to right, green, red, orange, blue);
  }
  span{ 
    color: gray;
    font-weight: 500;
    background: linear-gradient(blue, black);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-left: 5px;
  }
`;