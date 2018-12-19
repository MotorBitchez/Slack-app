import path from 'path';
import express from 'express';
import mockData from './mockData';
import axios from 'axios';
import WebSocket from 'ws';
const isDevMode = process.argv.includes('dev');

let _port = 80;

let content;
let orientation;
let user;

function update({URL}){
  if(isDevMode) return;
  process.send({type: 'update', path: URL});
}

function display({URL}){
  if(isDevMode) return;
  log({message: 'display sent back with path: ' + URL});
  process.send({type: 'display', path: URL});
}

function log({message}){
  if(isDevMode) return console.log(message);
  process.send({type: 'log', message});
}

function error({message}){
  if(isDevMode) return;
  process.send({type: 'error', message});
}

function ready(){
  if(isDevMode) return;
  process.send({type: 'isReady'});
}

/* Server Codes */

const app = express();
const staticPath = isDevMode 
  ? path.resolve(process.argv[1], '..', 'dist')
  : path.resolve(process.argv[1], '..', 'build');
app.set('public', staticPath);
app.use(express.static(app.get('public')));

function createServer({content, orientation, port, user}){
  app.get('/', (req, res) => {
    res.sendFile('index.html', {root: app.get('public')});
  });
  app.get('/info', (req, res) => {
    res.send(content);
  });
  app.get('/update', (req, res) => {
    res.send({
      messages, 
      typingUsers,
      websocketConnectionStatus});
  })
  app.listen(port, () => {
    log({message: `Listening on port ${port}`});
    ready();
  });
}

async function devMode(){
  await init({content: mockData.content, orientation: mockData.orientation, port: _port, user: mockData.user});
  createServer({content: mockData.content, orientation: mockData.orientation, port: _port, user: mockData.user});
}

if(isDevMode){
  devMode();
} else {
  process.on('message', async (data) => {
    switch (data.type){
      case 'init':
        log({message: 'App received init'});
        _port = data.port;
        let {content, orientation, port, user} = data;
        await init({content, orientation, port, user});
        createServer({content, orientation, port, user});
        break;
      case 'display':
        log({message: 'App received display'});
        display({URL: `http://localhost:${_port}`});
        break;
    }
  });
}


let messages = [];
let typingUsers = []; 
let websocketConnectionStatus = false;
async function init({content, orientation, port, user}){
  try {
    let promises = [];
    promises.push(getUsers(user.slackAccessToken));
    promises.push(getBots(user.slackAccessToken)); 
    promises.push(getMessages(user.slackAccessToken, content.slackData.channel.id)); 
    // promises.push(getChannels(user.slackAccessToken)); 
    promises.push(getTeamInfo(user.slackAccessToken));
    promises.push(getCustomIcons(user.slackAccessToken));

    let slackRes = await Promise.all(promises);
    content.users = slackRes[0];
    content.bots = slackRes[1]; 
    content.channelName = content.slackData.channel.name;
    content.team = slackRes[3];
    content.emoji_list = slackRes[4];
    content.slackAccessToken = user.slackAccessToken;
    content.selectedChannel = content.slackData.channel.name;
    content.typingUsers= typingUsers;

    const selectedBots = content.slackData.bots.map(bot => bot.id);
    content.selectedBots = selectedBots;
    const selectedUsers = content.slackData.users.map(user => user.id);
    content.selectedUsers = selectedUsers;
 
    const filteredMessages = filterMessages(slackRes[2], 
      selectedUsers, content.slackData.allUsers, 
      selectedBots, content.slackData.allBots);
    buildMessagesObject(filteredMessages);
    // await fixFilesProperties(messages, user.slackAccessToken)
    content.messages = messages; 

      
    const getDataInterval = setInterval(getDataManual, 5000);

    async function getDataManual(){
      try {
        let newMesages = await getMessages(user.slackAccessToken, content.slackData.channel.id);
        messages = [];
          // unhandledData = newMesages;
        let newFilteredMessages = filterMessages(newMesages, 
          selectedUsers, content.slackData.allUsers, 
          selectedBots, content.slackData.allBots);
          buildMessagesObject(newFilteredMessages, user.slackAccessToken);
          content.messages = messages;  
      } catch (error) {
        console.log(error);
      }
    }
    // const websocketUrl = await getWebsockedUrl(user.slackAccessToken); 
    // connectToWebsocket(websocketUrl, content, getDataInterval, getDataManual);
  } catch (err) {
    console.log(err);
  }
}

async function getWebsockedUrl(slackAccessToken){ 
  try {  
    const res = await axios.get(`https://slack.com/api/rtm.connect?token=${slackAccessToken}`);
    return res.data.url;
  } catch (error) {
    console.log(error);
  }
}

function addTypingUser(user, content){
  typingUsers.push(user);
  content.typingUsers = typingUsers;
  setInterval(() => {
    typingUsers = typingUsers.filter(u => u.id !== user.id);
    content.typingUsers = typingUsers;
  }, 4000);
}
 

async function connectToWebsocket(url, content, manualDataInterval, manualDataFunc){
  console.log('Websocked url called succesfully', url);

  const ws = new WebSocket(url); 
  ws.on('open', ()=> {
    console.log('Connected to slack websocket'); 
    clearInterval(manualDataInterval);
    console.log('pulling manual data is disabled');
  } );

  ws.on('close', () => {
    console.log('Websoket connection disabled'); 
    setInterval(manualDataFunc, 5000);
    console.log('Pulling manual data is enabled');
  });

  ws.on('message', res => {
    // console.log(res);
    // let data = JSON.parse(responses.data);
    // switch (data.type) {
    //   case "member_joined_channel":
    //     console.log(data.type);
      // if(message.legth )
      //   slackData.push(data)
      //   content.messages = messages;
  //     break;
  //     case "message"
  //   } 
  });
}





function buildMessagesObject(_messages){
  let lastDifferentMessageDay = '';
  let isToday = false;
  let previousMessageDate;

  for(let i = _messages.length-1; i >= 0; i--){ 
    const currentMessage = _messages[i]; 
    const previousMessage = messages[messages.length-1];

    const days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const messageDate = new Date(currentMessage.ts*1000);
    const messageTime = messageDate.getHours() + ':' + ('0' + messageDate.getMinutes()).slice(-2); 
    const key = currentMessage.ts + currentMessage.text;
    
    let now = new Date();
    const today = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();
    let messageDay = days[messageDate.getDay()] + ', ' + months[messageDate.getMonth()] + ' ' +  messageDate.getDate(); 

    let isMinuteLater = false; 
    if(previousMessageDate){
      isMinuteLater = messageDate.getMinutes() === previousMessageDate.getMinutes();
    }

    previousMessageDate = messageDate;

    if(messages.length == 0){

      if(today == messageDay){ 
        messageDay = 'Today'; 
        isToday = true;
      }else{
        lastDifferentMessageDay = messageDay;
      } 

      if(currentMessage.subtype){
        messages.push(createSubtypeMessageObj(currentMessage, messageDay, messageTime, key))
      }else{
        messages.push({
          user: currentMessage.user, 
          messageDay, 
          messageTime, 
          texts: [currentMessage. text],
          files: currentMessage.files,
          attachments: currentMessage.attachments,
          reactions: currentMessage.reactions,
          key
        });
      }
    }else{ // if its not first message 
      
      // arka arkaya attachment gönderildi ise onlarıda birleştireceğiz koşul buraya
      if(!currentMessage.subtype && previousMessage.user === currentMessage.user && isMinuteLater && previousMessage.subtype !== 'channel_join'){
        previousMessage.texts.push(currentMessage.text);
      }else{
        if(isToday){//önceki mesaj bugün ise sonraki mesajlarda direk bugün olur
          messageDay = false;
        }else{
          if(today === messageDay){
            messageDay = 'Today';
            isToday = true;
          }else if(lastDifferentMessageDay !== messageDay){
            lastDifferentMessageDay = messageDay;
          }else{
            //messageDay = false olduğu zaman map ile elemen oluşturma sırasında gün ile alakalı herhangi bir işlem yapılmayacak
            messageDay = false;
          }
        }
        if(currentMessage.subtype){
          messages.push(createSubtypeMessageObj(currentMessage, messageDay, messageTime, key))
        }else{
          messages.push({
            user: currentMessage.user, 
            messageDay, 
            messageTime, 
            texts: [currentMessage. text],
            files: currentMessage.files,
            attachments: currentMessage.attachments,
            reactions: currentMessage.reactions,
            key
          });
        }
      }
    }
  }// döngü bitişi
  messages = messages.slice(-20);
}



function createSubtypeMessageObj(message, messageDay, messageTime, key){
  if(message.subtype == 'bot_add' || message.subtype == 'bot_remove'){
    return {
      user: message.user, 
      bot: message.bot_id, 
      messageDay, 
      messageTime, 
      subtype: message.subtype,
      text: message.text,
      key
    }
  }else if(message.subtype == 'bot_message'){
    return {
      user: message.user, 
      bot: message.bot_id, 
      messageDay, 
      messageTime, 
      subtype: message.subtype,
      text: message.text,
      files: message.files,
      attachments: message.attachments,
      reactions: message.reactions,
      key,
    }
  }else if(message.subtype == 'channel_join'){
    return {
        user: message.user, 
        messageDay, 
        messageTime, 
        subtype: message.subtype,
        text: message.text,
        key: key + message.user
    }
  }else {
      return { user: 'unknown subtype' + message.subtype}
  }
}
/*
async function fixFilesProperties(messages, slackAccessToken){
  // new Promise((reject, resolve) =>{
    try {
      for(let i = 0; i < messages.length; i++){
        console.log('döngü dönüyor', i);
        if(messages[i].files){
          messages[i].files = await getShareableFile(messages[i].files.id, slackAccessToken);
          console.log(messages[i].files);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  // })
}

async function getShareableFile(fileID, slackAccessToken){
  try {   
    const res = axios.get(`https://slack.com/api/files.sharedPublicURL?token=${slackAccessToken}&file=${fileID}`);
    return {
      timeStamp: res.data.file.timestamp,
      title: res.data.file.title, 
      mimetype: res.data.file.mimetype, 
      link: res.data.file.permalink_public
    };
  } catch (error) {
    console.log(error.message)
  }
}*/

function filterMessages(messageData, selectedUsers, allUsers, selectedBots, allBots){
  // const isAllUsers = selectedUsers.find(user => user.id == 'all');
  // const isAllBots = selectedBots.find(bot => bot.id == 'all');
  
  return messageData.filter(message => {
    if(message.subtype){
      if(message.subtype == 'channel_join'){
        return true;
      }else if(message.subtype == 'bot_add' || message.subtype == 'bot_message'){
        if(selectedBots.includes(message.bot_id) || allBots){
          return true;
        } 
      }
    }else{ //if its normal message
      if(selectedUsers.includes(message.user) || allUsers){
        return true;
      }
    }
  })
}



async function getTeamInfo(token){ 
  try{
    let res = await axios.get(`https://slack.com/api/team.info?token=${token}`); 
    return res.data.team;
  }catch(err){
    console.log('@getting data error', err);
  }
}

async function getMessages(token, channel){ 
  try{
    let res = await axios.get(`https://slack.com/api/channels.history?token=${token}&channel=${channel}`); 
    return res.data.messages;
  }catch(err){
    console.log('@getting data error', err);
  }
}

async function getChannels(token){ 
  try{
    let res = await axios.get(`https://slack.com/api/channels.list?token=${token}`); 
    return res.data.channels;
  }catch(err){
    console.log('@getting data error', err);
  }
}

async function getUsers(token){ 
  try{
    let res = await axios.get(`https://slack.com/api/users.list?token=${token}`);
    return res.data.members;
  }catch(err){
    console.log('@getting data error', err);
  }
} 

async function getBots(token){ 
  try{
    let res = await axios.get(`https://slack.com/api/bots.list?token=${token}`);
    return res.data.bots;
  }catch(err){
    console.log('@getting data error', err);
  }
}
async function getCustomIcons(token){ 
  try{
    let res = await axios.get(`https://slack.com/api/emoji.list?token=${token}`);
    return res.data.emoji;
  }catch(err){
    console.log('@getting data error', err);
  }
}