import React from 'react';
import emojione from 'emojione';
import {css} from 'react-emotion';  

let currentText = '';

export const Reaction =  (props) =>{
  const content = props.reactions.map(reaction => {
    const html = `${emojione.shortnameToImage(':'+reaction.name+':')}  <span>${reaction.count}</span>`;
    if (!html.includes('<img')) return null;
    return <div className={singleReactionStyle} dangerouslySetInnerHTML={{__html: html}} key={reaction.name}/>
  });
  return (
    <div className={reactionContainer} >
      {content}
    </div>
  );
};
 
export function prepareText(message, users, channels){
  currentText = message.trim();
  convertTags(users, channels);
  convertBoldText();
  currentText = emojione.shortnameToImage(currentText);
  function createMarkup(){return {__html: currentText}}
  return <span className={singleMessageStyle} key={Math.random()*15141413} dangerouslySetInnerHTML={createMarkup()} />
}

let boldTextIndex = 0;
function convertBoldText(){
  const tagStart = currentText.indexOf('*', boldTextIndex);
  if (tagStart !== -1){
    boldTextIndex = tagStart+1;
    const tagEnd = currentText.indexOf('*', tagStart+1); 
    if (tagEnd !== -1){
      const boldText = currentText.slice(tagStart+1, tagEnd);
      currentText = currentText.replace('*' + boldText + '*', `<strong>&nbsp${boldText}&nbsp</strong>`);
      convertBoldText();
    }
  } else {
    boldTextIndex = 0;
  }
}

let textIndex = 0;
function convertTags(users, channels){
 const tagStart = currentText.indexOf('<', textIndex);
 if (tagStart !== -1){
	textIndex = tagStart + 1;
 	const tagEnd = currentText.indexOf('>', tagStart);
    if (tagEnd !== -1){
      const content = currentText.slice(tagStart+1, tagEnd);
      if (content.indexOf('#') == 0){ //if its channel
        convertChannelTag(content, channels);
      } else if (content.indexOf('@') == 0){ //if its user
        convertUserTag(content, users);
      } else if(content.indexOf('http') == 0){//if its a link
        convertLinkTag(content);
      } else if(content.indexOf('mailto:') == 0){ //if its a mail
        convertMailTag(content);
      } else if(content.indexOf('!date') == 0){ //if its a date
				convertDateTag(content);
			}
			/* else if(content.indexOf('!everyone') == 0){
				convertVariableTag(content, 'everyone');
			}*/
      convertTags();
	  }
  } else {
	  textIndex = 0;
  }
}

function convertDateTag(content){
	const days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const monthsL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const monthsS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	const arr = content.split('|');
	let timeStampContent;
	for (let i = 0; i < arr.length; i++){
    if(arr[i].includes('^')){
      timeStampContent = arr[i];
    }
  }
	if(!timeStampContent){
		currentText = currentText.replace('<' + content + '>', arr[0]);
		return;
	}
	timeStampContent = timeStampContent.replace('!date', '');
	let timeStampStart = timeStampContent.indexOf('^');
	const timeStamp = timeStampContent.slice(timeStampStart+1, timeStampContent.indexOf('^', timeStampStart+1));
	const date = new Date(timeStamp*1000);
	timeStampContent = timeStampContent.replace(`^${timeStamp}^`, '');
	if(timeStampContent.includes('{date_num}')){
		const dateText = `${date.getFullYear()}-${("0" + (date.getMonth())).slice(-2)}-${("0" + (date.getDate())).slice(-2)}`
		timeStampContent = timeStampContent.replace('{date_num}', dateText);
	} else if(timeStampContent.includes('{date}')){
		const dateText = `${monthsL[date.getMonth()]} ${date.getDate()}th, ${date.getFullYear()}`;
		timeStampContent = timeStampContent.replace('{date}', dateText); 
	} else if(timeStampContent.includes('{date_short}')){
		const dateText = `${monthsS[date.getMonth()]} ${("0" + (date.getDate())).slice(-2)}, ${date.getFullYear()}`;
		timeStampContent = timeStampContent.replace('{date_short}', dateText); 
	} else if(timeStampContent.includes('{date_long}')){
		const dateText = `${days[date.getDay()]}, ${monthsL[date.getMonth()]} ${date.getDate()}th, ${date.getFullYear()}`;
    timeStampContent = timeStampContent.replace('{date_long}', dateText);  
  } else if(timeStampContent.includes('{date_pretty}')){
		let dayText, dateText;
    const today = new Date(); 
    const diffDays = (date.getYear()+date.getMonth()+date.getDate()) - (today.getYear()+today.getMonth()+today.getDate()); 
		if (diffDays == 0){
			 dayText = 'Today';
		} else if (diffDays == -1){
			dayText = 'Tomorrow';
		} else if (diffDays == 1){
			dayText = 'Yesterday';
    }
    if (dayText){
      dateText = dayText;
    } else {
      dateText = `${monthsL[date.getMonth()]} ${date.getDate()}th, ${date.getFullYear()}`;
    }
		timeStampContent = timeStampContent.replace('{date_pretty}', dateText); 
	} else if(timeStampContent.includes('{date_short_pretty}')){
		let dayText, dateText;
    const today = new Date();
    const diffDays = (date.getYear()+date.getMonth()+date.getDate()) - (today.getYear()+today.getMonth()+today.getDate()); 
		if (diffDays == 0){
			 dayText = 'Today';
		} else if (diffDays == -1){
			dayText = 'Yesterday';
		} else if (diffDays == 1){
      dayText = 'Tomorrow';
    }
    if (dayText) {
      dateText = dayText;
    } else {
      dateText = `${monthsS[date.getMonth()]} ${("0" + (date.getDate())).slice(-2)}, ${date.getFullYear()}`;
    }
		timeStampContent = timeStampContent.replace('{date_short_pretty}', dateText); 
	} else if(timeStampContent.includes('{date_long_pretty}')){
		let dayText, dateText;
		const today = new Date();
    const diffDays = (date.getYear()+date.getMonth()+date.getDate()) - (today.getYear()+today.getMonth()+today.getDate()); 
		if (diffDays == 0){
			 dayText = 'Today';
		} else if (diffDays == -1){
			dayText = 'Tomorrow';
		} else if (diffDays == 1){
			dayText = 'Yesterday';
    }
    if (dayText){
      dateText = dayText;
    } else {
      dateText = `${days[date.getDay()]}, ${monthsL[date.getMonth()]} ${date.getDate()}th, ${date.getFullYear()}`;
    }
		timeStampContent = timeStampContent.replace('{date_long_pretty}', dateText);  
	}
	if (timeStampContent.includes('{time}')){
		const timeText = ("0" + (date.getHours())).slice(-2) + ':' + ("0" + (date.getMinutes())).slice(-2);
		timeStampContent = timeStampContent.replace('{time}', timeText);  
	} else if(timeStampContent.includes('{time_secs}')){
		const timeText = ("0" + (date.getHours())).slice(-2) + ':' + ("0" + (date.getMinutes())).slice(-2) + ':' + ("0" + (date.getSeconds())).slice(-2);
		timeStampContent = timeStampContent.replace('{time_secs}', timeText);  
	}
	//if it is date contains link
	if (timeStampContent.includes('^')){
		timeStampContent = timeStampContent.slice(0, timeStampContent.indexOf('^'));
		timeStampContent = '<span style="font-weight: bold; color: dodgerblue">' + timeStampContent + '</span>';
	}
	currentText = currentText.replace('<' + content + '>', timeStampContent);
}

function convertMailTag(content){
  const arr = content.split('|');
  let convertedContent;
  for (let i = 0; i < arr.length; i++){
    if (arr[i].indexOf('@') !== -1){
      convertedContent = arr[i];
    }
  }
  if (convertedContent){
		convertedContent = convertedContent.replace('mailto:', '');
		convertedContent = `<span style="font-weight: bold; color: dodgerblue;">${convertedContent}</span>`;	
  } else {
		convertedContent = arr[0].replace('mailto:', '');
		convertedContent = `<span style="font-weight: bold; color: dodgerblue;">${convertedContent}</span>`;
  }
 	currentText = currentText.replace('<' + content + '>', convertedContent);
}

function convertLinkTag(content){
  const arr = content.split('|');
  let convertedContent;
  for (let i = 0; i < arr.length; i++){
    if (!arr[i].includes('www')){
      convertedContent = arr[i];
    }
  }
  if (convertedContent){
  	convertedContent = `<span style="font-weight: bold; color: dodgerblue;">&nbsp${convertedContent}</span>`;
	} else {
  	convertedContent = `<span style="font-weight: bold; color: dodgerblue;">&nbsp${arr[0]}</span>`;
  }
 	currentText = currentText.replace('<' + content + '>', convertedContent);
}

function  convertUserTag(content, users){ 
  const arr = content.split('|'); 
  let convertedContent;
  for (let i = 0; i < arr.length; i++){
    if (arr[i].indexOf('@') == 0){
      convertedContent = arr[i];
    }
  }
  if (convertedContent){
    convertedContent = convertedContent.replace('@', '');
    const findedUser = users.find(user => user.id == convertedContent);
    convertedContent = `<span style="font-weight: bold; color: navy"> ${findedUser.profile.real_name}</span>`;
  } else {
		convertedContent = `<span style="font-weight: bold; color: navy"> ${arr[0]}</span>`;
  }
 	currentText = currentText.replace('<' + content + '>', convertedContent);
}

function  convertChannelTag(content){
  const arr = content.split('|'); 
  console.log(content);
  let convertedContent;
  for (let i = 0; i < arr.length; i++){
    if (arr[i].indexOf('#') == 0){
      convertedContent = arr[i];
    }
  }
  if (convertedContent){
		convertedContent = `<span style="font-weight: bold; color: navy"> ${convertedContent}</span>`;
  } else {
		convertedContent = `<span style="font-weight: bold; color: navy"> ${arr[0]}</span>`;
  }
 	currentText = currentText.replace('<' + content + '>', convertedContent);
}

const reactionContainer = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 25px;
`;

const singleReactionStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 40px;
  height: 25px;
  border: 1px solid gray;
  background: white;
  margin: 10px 5px !important;
  border-radius: 5px !important;
  img{
    width: 15px !important;
    height: 15px !important;
  }
  span{
    font-size: 0.7em;
    color: blue;
    font-weight: bold;
    padding-right: 3px;
  }
`;

const singleMessageStyle = css`  
  white-space: pre-wrap;
  line-height: 25px;
`;