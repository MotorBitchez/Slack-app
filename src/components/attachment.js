import React from 'react';
import emojione from 'emojione';
import {css} from 'react-emotion'; 
import {prepareText} from './elements';

const AttachmentAuthor = (props) => {  
  let image;
  if(props.attachment.service_icon){
    image = <img src={props.attachment.service_icon} />;
  }
  return(
    <div id="author">
      {image}
      <span>{props.attachment.service_name}</span>
    </div>
  ) 
}

const AttachmentFields = props => {
    return(
    <div className={attachmentFieldStyle}  >  
      {props.attachment.fields.map(field =>  {
        let shortStyle;
        if(field.short){
          shortStyle= {display: 'inline-block', marginRight: '35px'};
        }
          return <div id="field" style={shortStyle} key={field.title + field.value}>
                  <p><strong>{field.title}</strong></p>
                  <p>{field.value}</p>
                </div>
      })}
    </div>
  )
}

const attachmentFieldStyle = css`
  padding: 5px 0 5px 0px;
  
  #field{
    padding: 5px 0;
  }
 
`;

const AttachmentImage = props => {  
  let dateInfo;
  if(props.attachment.ts){ 
	  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date=  new Date(props.attachment.ts*1000); 
    dateInfo = <span style={{color: 'gray', margin: '10px 0 4px 0'}}>{months[date.getMonth()] + ' ' + date.getDate()}</span>
  }

  return( 
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
        {dateInfo}
        <img src={props.attachment.image_url} style={{maxHeight: '200px', maxWidth: '200px', borderRadius: '5px',
        border: '1px solid lightgray'}}  /> 
    </div>
  )
}

const AttachmentThumb = props => {
  if(!props.attachment.thumb_url) return null;
            
  return( 
    <div style={{width: '75px', height: '75px', backgroundImage: `url(${props.attachment.thumb_url})`, 
        backgroundSize: 'cover' }}/>
  )
}

const AttachmentFooter = (props) => {

  let image, time;
  if(props.attachment.footer_icon){
    image = <img style={{height: '100%', width: 'auto', paddingRight: '7px'}} src={props.attachment.footer_icon} />;
  }

  if(props.attachment.ts){
    const date = new Date(props.attachment.ts*1000);
    time =  <span style={{padding: '0 5px', color: 'gray'}}>
              {Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short',
                  day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(date)}
            </span>
  }
  
  return(
    <div style={{width: '100%', height: '30px', display: 'flex', 
      justifyContent: 'flex-start', alignItems: 'center', paddingTop: '6px', 
      fontSize: '0.9em'}}>
      {image}
      <span style={{color: 'gray'}}>{props.attachment.footer}</span>
      {time}
    </div>
  )
}

const AttachmentActions = (props) => {  
  let colorStyle = {borderColor: 'gray', color: 'black'}



  return(
    <div className={attachmentActionStyle}>
      {props.attachment.actions.map(action => {
        if(action.style == 'danger'){
          colorStyle = {borderColor: 'red', color: 'red'};
        }else if(action.style == 'primary'){
          colorStyle = {borderColor: '#008952', color: '#008952'}
        }
        if(action.type == 'button'){
          return <button id="action-button" style={colorStyle}
                key={action.text + action.url + action.type}>{action.text}</button>

        }else if(action.type == 'select'){

          return <select id="action-select" key={action.text + action.url + action.type}>
            <option>{action.text || 'Choose an option...'}</option></select>
        }
      })}
    </div>
  )
}

const attachmentActionStyle = css` 
  padding: 5px;
 
  #action-button{
    height: 30px;
    background: white;
    border: 1px solid;
    border-radius: 4px; 
    font-weight: bold; 
    margin: 5px;
  }
  
  #action-select{
    margin: 5px;
    width: 200px;
    height: 30px;
    background: white;
    border: 1px solid;
    border-radius: 4px; 
    color: rgb(90, 90, 90); 
  }
`;

export const Attachment = (props) => {

  
  let pretext, title, text;
  let color = 'rgba(0, 0, 0, 0.2)';
  if(props.attachment.color){ 
    if(props.attachment.color == 'good'){
      color = 'limegreen';
    }else if(props.attachment.color == 'warning'){
      color = 'orange';
    }else if(props.attachment.color == 'red'){
      color = 'red';
    }else{ 
      color = '#'+props.attachment.color
    }
  }

  if(props.attachment.pretext){
    pretext = <p style={{paddingTop: '10px'}}>{props.attachment.pretext}</p>
  }
  // props.attachment.author_name= "Bobby Tables";
  // props.attachment.author_link= "http://flickr.com/bobby/";
  // props.attachment.author_icon= "https://a.slack-edge.com/66f9/img/avatars/ava_0002-48.png";
 
  if(props.attachment.title){
    if(props.attachment.title_link){
      title = <div id="title_link">{props.attachment.title}</div>
    }else{
      title = <div id="title">{props.attachment.title}</div>
    }
  }

  if(props.attachment.text){
    text = <div id="text" >{prepareText(props.attachment.text, props.users, props.channels)}</div>
  } 
 
  // props.attachment.fields = [
  //   {
  //     "title": "Priority",
  //     "value": "High",
  //     "short": true
  // },{
  //   "title": "deneme",
  //   "value": "High",
  //   "short": true
  // }
  // ] 
  
//   props.attachment.image_url = 'https://images-na.ssl-images-amazon.com/images/I/61i3Zw2JtVL._SX425_.jpg';
//   props.attachment.thumb_url = 'https://images-na.ssl-images-amazon.com/images/I/61i3Zw2JtVL._SX425_.jpg';
//   props.attachment.footer = 'Gökhan Aslan';
//   props.attachment.footer_icon = 'https://images-na.ssl-images-amazon.com/images/I/61i3Zw2JtVL._SX425_.jpg';
//   props.attachment.ts = '123456789';
//   props.attachment.actions=  [{
//     "type": "button",
//     "text": "Buna tıkla",
//     "style": 'danger', 
//     "url": "https://flights.example.com/book/r123456"
//   },{
//     "type": "select",
//     "text": "Seçiniz",
//     "style": "primary",
//     "url": "https://flights.example.com/book/r123456"
//   }
// ]
  let thumbStyle = {display: 'grid', gridTemplateColumns: 'auto'};
  if(props.attachment.thumb_url){
    thumbStyle = {display: 'grid', gridTemplateColumns: 'auto 75px'};
  }
  return( 

    <div className={attachmentStyle}>
      {pretext}
      <div style={thumbStyle}>
        <div style={{borderLeft: `4px solid ${color}`, marginTop: '10px', padding: '0 10px'}}>
            {props.attachment.service_icon && <AttachmentAuthor attachment={props.attachment} />}
            {title}
            {text}
            {props.attachment.fields &&  <AttachmentFields attachment={props.attachment} />}
            {props.attachment.image_url && <AttachmentImage attachment={props.attachment} /> }
            {(props.attachment.footer || props.attachment.footer_icon) && <AttachmentFooter attachment={props.attachment} /> }
            {props.attachment.actions && <AttachmentActions attachment={props.attachment} /> }
        </div>
        {props.attachment.thumb_url && <AttachmentThumb attachment={props.attachment} />}
      </div>
    </div>
  )
}



const attachmentStyle = css ` 
  #title_link{
    font-weight: bold;
    color: dodgerblue;
    padding-bottom: 5px;
  }
  
  #title{
    font-weight: bold;
    padding: 2px 0;
  }

  #author{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 22px;
    padding: 0 0 6px 2px;
  }

  #author img{
    height: 100%;
    width: auto;
    border-radius: 5px;
    margin-right: 8px;
  }

  #author span{
    color: rgb(90, 90, 90);
  }

  #footer{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 25px;
  }

  #footer img{
    height: 100%;
  }

  #text{
    line-height: 25px; 
  }

`;