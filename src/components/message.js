import {prepareText, Reaction} from "./elements";
import {Attachment} from "./attachment";
import React from "react";
import {css} from "emotion";

export const Message = (props) => {
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
            return prepareText(text, props.users);
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

const messageStyle = css`
  width: 100%;
  display: grid;
  grid-template-columns: 64px auto;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 25px;
`;

const userMessage = css`
  display: flex;
  flex-direction: column;
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