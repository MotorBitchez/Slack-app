import React, {useState, useEffect} from 'react';
import {css} from 'emotion';
import slackIcon from './../images/slackLogo.png';
import { Separator } from "./separator";
import dateFns from 'date-fns';
import localeTr from 'date-fns/locale/tr';
import {Avatar} from "./avatar";
import {ProfileInfo} from "./profile-info";
import {ContentHolder} from "./content-holder";
import {Text} from "./text";
import {MessageFile} from "./message-file";
import {Attachment} from "./attachment";
import {prepareText} from "./elements";
import {Reactions} from "./reactions";

export function SlackApp({content}){
  const [date, setDate] = useState(dateFns.addHours(new Date(), 3));
  let timeInterval;
  useEffect(() => {
    timeInterval = setInterval(() => {
      setDate(dateFns.addHours(new Date(), 3));
    }, 60 * 1000);
    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    }
  }, []);
  let teamImage = content.team.icon.image_230 || content.team.icon.image_132 || content.team.icon.image_original;
  return (
    <React.Fragment>
    <div className={leftPanel}>
      <div className={dateContainer}>
        <span style={{fontSize: '4em', fontFamily: 'Futura'}}>{dateFns.format(date, 'HH:mm')}</span>
        <span style={{fontSize: '1.2em', fontFamily: 'Futura'}}>{dateFns.format(date, 'dddd', {locale: localeTr})}</span>
      </div>
      <div className={iconContainer}>
        <img src={teamImage}/>
        <span style={{fontFamily: 'Futura', fontSize: '1.2em'}}>{content.team.name}</span>
      </div>
      <div className={channelsContainer}>
        <span># <span style={{fontFamily: 'Futura', fontSize: '1.1em'}}>{content.channelName}</span></span>
      </div>
      <div style={{position: 'absolute', left: '15px', bottom: '15px'}}>
        <img style={{width: '50px', height: 'auto'}} src={slackIcon} />
      </div>
    </div>
    <div className={messagePanel}>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        {content.data.map((day) => {
          return (
            <React.Fragment key={day.date}>
              <Separator date={day.date}/>
              {day.entries.map((entry) => <Message key={entry.ts} entry={entry} users={content.users} bots={content.bots}/>)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
    </React.Fragment>
  );
}

const messageStyle = css`
  display: flex;
  margin-bottom: 25px;
`;

const Message = ({entry, users, bots}) => {
  return (
    <div className={messageStyle}>
      <Avatar profile={entry.profile}/>
      <ContentHolder>
        <ProfileInfo name={entry.profile.real_name || entry.profile.name || 'Unknown'} time={entry.ts}/>
        {entry.texts
          ?
          entry.texts.map((textItem, idx) => <Text key={textItem.text + idx} text={prepareText(textItem.text, users, bots)} reactions={textItem.reactions}/>)
          :
          <Text text={prepareText(entry.text, users, bots)} reactions={(entry.files || entry.attachments) ? [] : entry.reactions}/>}
        {entry.files && entry.files.map((file, idx) => <MessageFile file={file} reactions={entry.reactions}/>)}
        {entry.attachments && entry.attachments.map(attachment => <Attachment attachment={attachment} users={users} bots={bots}/>)}
        {entry.attachments && <Reactions reactions={entry.reactions}/>}
      </ContentHolder>
    </div>
  );
};
  
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

const messagePanel = css`
  display: flex;
  align-items: flex-end;
  padding: 0 50px;
  overflow: hidden;
  height: 100vh;
  transition: all 0.3s;
  background: linear-gradient(to right bottom, rgba(76, 175, 80, 0.07), rgba(255, 193, 7, 0.07), rgba(33, 150, 243, 0.07), rgba(236, 64, 122, 0.07));
`;