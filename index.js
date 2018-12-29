import path from 'path';
import express from 'express';
import mockData from './mockData';
import axios from 'axios';
import dateFns from 'date-fns';
const isDevMode = process.argv.includes('dev');

let _port = 80;

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

async function init({content, orientation, port, user}){
  try {
    let initialPayload = await axios.post('https://dashboard.dashmon.com/api/slackinitialinfo', {contentId: content._id});
    content.users = initialPayload.data.users;
    content.bots = initialPayload.data.bots;
    content.channelName = content.slackData.channel.name;
    content.team = initialPayload.data.team;
    content.emojis = initialPayload.data.emojis;
    content.selectedUserIds = content.slackData.users.map(user => user.id);
    content.initial = initialPayload.data;
    let rawMessages = initialPayload.data.messages.filter(message => {
      // filter out join etc. messages
      if (message.subtype && ['channel_join', 'bot_add', 'bot_remove'].includes(message.subtype)) return false;
      // filter out bot messages if apps are not selected
      if (!content.slackData.showApps && message.subtype && message.subtype === 'bot_message') return false;
      // filter out unselected users if all users is not selected
      if (!content.slackData.allUsers && message.user && !content.selectedUserIds.includes(message.user)) return false;
      return true;
    });
    content.data = setProfiles(processMessages(rawMessages), content.bots, content.users);
  } catch (err) {
    content.error = err.message;
    log({message: err.message});
  }
}

/*
[
  {
    date,
    entries: [
      { userId,
        ts,
        texts [ {text, reactions, file | attachment} ] }
    ]
  }
]
*/

function processMessages(rawMessages){
  let data = [];
  let firstMessage = rawMessages[0];
  let currentDay = {date: firstMessage.ts, entries: []};
  for (let index in rawMessages) {
    let currentMessage = rawMessages[index];
    let previousMessage = rawMessages[index - 1];
    let diff = Math.abs(dateFns.differenceInCalendarDays(new Date(currentMessage.ts * 1000), new Date(currentDay.date * 1000)));
    if (diff > 0) {
      data.push(currentDay);
      currentDay = {date: currentMessage.ts, entries: []};
    }
    if (currentMessage.subtype && currentMessage.subtype === 'bot_message') {
      currentDay.entries.push(currentMessage);
      continue;
    }
    if (currentMessage.files || currentMessage.attachments) {
      currentDay.entries.push(currentMessage);
      continue;
    }
    if (previousMessage && previousMessage.user === currentMessage.user &&
      !previousMessage.files && !previousMessage.attachments &&
      !dateFns.isAfter(new Date(currentMessage.ts * 1000), dateFns.addMinutes(new Date(previousMessage.ts * 1000), 1)) &&
      dateFns.differenceInCalendarDays(new Date(currentMessage.ts * 1000), new Date(currentDay.date * 1000)) < 1 &&
      currentDay.entries[currentDay.entries.length - 1]
    ) {
      currentDay.entries[currentDay.entries.length - 1].texts.push({text: currentMessage.text, reactions: currentMessage.reactions});
      continue;
    }
    currentMessage.texts = [{text: currentMessage.text, reactions: currentMessage.reactions}];
    currentDay.entries.push(currentMessage);
  }
  data.push(currentDay);
  return data;
}

function setProfiles(_data, bots, users){
  let data = Array.from(_data);
  data.forEach(day => {
    day.entries.forEach(entry => {
      if (entry.subtype && entry.subtype === 'bot_message') {
        entry.profile = bots.find(bot => bot.id === entry.bot_id);
      } else {
        entry.profile = users.find(user => user.id === entry.user);
      }
    });
  });
  return data;
}