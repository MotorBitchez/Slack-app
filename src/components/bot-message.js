import {Attachment} from "./attachment";
import React from "react";
import {css} from "emotion";

export const BotMessage = ({message, bots, users}) => {
  const bot = bots.find(bot => bot.id == props.bot);
  // todo if there is no bot, trigger bots.info from the server, show fallback
  let imageStyle = {};
  imageStyle.backgroundImage = bot.icons && bot.icons.image_72 || bot.icons.image_48 || bot.icons.image_36;
  return (
    <div className={botMessageStyle}>
      <div className={userPicture} style={imageStyle}/>
      <div className={'bot-message-container'}>
        <div className={'bot-info-container'}>
          <span className={'user-name'}>{bot.name}</span>
          <span className={'bot-tag'}>APP</span>
          <span className={'time'}>{message.messageTime}</span>
        </div>
        <div className={'attachment-container'}>
          <span>{message.text}</span>
          {message.attachments && message.attachments.map(attachment =>{
            return <Attachment key={`${attachment.callback_id}${attachment.id}`} attachment={attachment} users={users}/>
          })}
        </div>
      </div>
    </div>
  );
};

const userPicture = css`
  width: 50px;
  height: 50px;
  background-repeat: no-repeat; 
  background-size: cover;
  border-radius: 5px;
`;

const botMessageStyle = css`
  display: grid;
  grid-template-columns: 64px auto;
  justify-content: flex-start;
  align-items: flex-start;   
  margin-bottom: 20px;
  .bot-message-container{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;   
    background: white;
    padding: 7px 10px;
    border-radius: 5px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
  }
  .bot-info-container{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .user-name{
    font-weight: bold;
  }
  .bot-tag{
    background: lightgray;
    color: gray;
    padding: 2px;
    font-size: 0.6em;
    margin-left: 7px;
  }
  .time{
    font-size: 0.75em;
    margin-left: 7px;
    color: gray;
  }
`;