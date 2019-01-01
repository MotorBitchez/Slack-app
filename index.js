import path from 'path';
import express from 'express';
import mockData from './mockData';
import axios from 'axios';
import dateFns from 'date-fns';
const isDevMode = process.argv.includes('dev');

let _port = 80;

let globalContent = {};
let globalCount = 0;

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
  app.get('/count', (req, res) => {
    res.send({count: globalCount});
  });
  app.get('/info', (req, res) => {
    res.send({
      users: globalContent.users,
      bots: globalContent.bots,
      channelName: globalContent.channelName,
      team: globalContent.team,
      emojis: globalContent.emojis,
      data: globalContent.data
    });
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
      case 'slackdata':
        processWebhookData(data.event);

    }
  });
}

async function init({content, orientation, port, user}){
  try {
    console.log('id', content._id);
    let initialPayload = await axios.post('https://dashboard.dashmon.com/api/slackinitialinfo', {contentId: content._id});
    console.log(Object.keys(initialPayload.data));
    content.users = initialPayload.data.users;
    content.bots = initialPayload.data.bots;
    content.channelName = content.slackData.channel.name;
    content.team = initialPayload.data.team;
    content.emojis = initialPayload.data.emojis;
    content.selectedUserIds = content.slackData.users.map(user => user.id);
    content.initial = initialPayload.data;
    content.messages = initialPayload.data.messages;
    content.filteredMessages = filterMessages(content.messages, content.slackData.showApps, content.slackData.allUsers, content.selectedUserIds);
    content.data = setProfiles(processMessages(content.filteredMessages), content.bots, content.users);
    globalContent = content;
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

function filterMessages(unfilteredMessages, showApps, allUsers, selectedUserIds){
  try {
    let filtered = unfilteredMessages.filter(message => {
      // filter out join etc. messages
      if (message.subtype && ['channel_join', 'bot_add', 'bot_remove'].includes(message.subtype)) return false;
      // filter out bot messages if apps are not selected
      if (!showApps && message.subtype && message.subtype === 'bot_message') return false;
      // filter out unselected users if all users is not selected
      if (!allUsers && message.user && !selectedUserIds.includes(message.user)) return false;
      return true;
    });
    return filtered.slice(0, 20);
  } catch (e) {
    console.log('filter messages error', e.message);
  }
}

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
    // && currentDay.entries[currentDay.entries.length - 1] alltan bunu kaldırdım
    // currentDay.entries.length > 0 ile değiştirdim
    if (previousMessage && previousMessage.user === currentMessage.user &&
      !previousMessage.files && !previousMessage.attachments &&
      (currentMessage.ts - previousMessage.ts) < 60 &&
      currentDay.entries.length > 0
    ) {
      currentDay.entries[currentDay.entries.length - 1].texts.push({text: currentMessage.text, reactions: currentMessage.reactions});
      continue;
    }
    currentMessage.texts = [{text: currentMessage.text, reactions: currentMessage.reactions}];
    currentDay.entries.push(currentMessage);
  }
  data.push(currentDay);
  data.reverse();
  data.forEach(day => {
    day.entries.reverse();
    day.entries.forEach(entry => {
      if (entry.texts) entry.texts.reverse();
    });
  });
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

function processWebhookData(event){
  let changed = false;
  switch (event.type) {
    case 'message':
      if (event.subtype) {
        switch (event.subtype) {
          case 'message_deleted':
            if (globalContent.slackData.channel.id === event.channel) {
              let deletedMessage = globalContent.messages.find(message => message.ts === event.deleted_ts);
              if (deletedMessage) {
                console.log(`Deleted message text is: ${deletedMessage.text}`);
                globalContent.messages = globalContent.messages.filter(message => message.ts !== event.deleted_ts);
                changed = true;
              } else {
                console.log(`Deleted message with ts: ${event.ts}, deleted_ts: ${event.deleted_ts} not found in global content`);
                let messageWithTS = globalContent.messages.find(message => message.ts === event.ts);
                if (messageWithTS) {
                  console.log(`Text of message with ts is: ${messageWithTS.text}`);
                } else {
                  console.log(`Message with event.ts is not found either`);
                }
              }
            }
            break;
          case 'message_changed':
            if (globalContent.slackData.channel.id === event.channel) {
              let changedMessage = globalContent.messages.find(message => message.ts === event.message.ts);
              if (changedMessage) {
                console.log(`Changed message | Old text is: ${changedMessage.text} - New text is: ${event.message.text}`);
                changedMessage.text = event.message.text;
                changed = true;
              } else {
                console.log(`Changed message with ts: ${event.message.ts} not found in global content`);
              }
            }
            break;
          case 'message_replied':
            if (globalContent.slackData.channel.id === event.channel) {
              globalContent.messages.unshift(event.message);
              changed = true;
            }
            break;
          case 'bot_message':
            if (globalContent.slackData.channel.id === event.channel) {
              globalContent.messages.unshift(event);
              changed = true;
            }
            break;
        }
      } else {
        if (globalContent.slackData.channel.id === event.channel) {
          globalContent.messages.unshift(event);
          changed = true;
        }
      }
      break;
    case 'channel_rename':
      if (globalContent.slackData.channel.id === event.channel.id) {
        globalContent.channelName = event.channel.name;
        changed = true;
      }
      break;
    case 'file_change':
      break;
    case 'file_comment_added':
      break;
    case 'file_comment_deleted':
      break;
    case 'file_comment_edited':
      break;
    case 'file_created':
      break;
    case 'file_deleted':
      break;
    case 'file_shared':
      break;
    case 'file_public':
      break;
    case 'file_unshared':
      break;
    case 'member_joined_channel':
      if (event.channel === globalContent.slackData.channel.id) {
        console.log(`User ${event.user} joined this channel`);
      } else {
        console.log(`User ${event.user} joined channel ${event.channel}`);
      }
      break;
    case 'member_left_channel':
      if (event.channel === globalContent.slackData.channel.id) {
        console.log(`User ${event.user} left this channel`);
      } else {
        console.log(`User ${event.user} left channel ${event.channel}`);
      }
      break;
    case 'team_join':
      break;
    case 'user_change':
      console.log(`User changed: ${JSON.stringify(event.user)}`);
      break;
    case 'reaction_added':
      if (globalContent.slackData.channel.id === event.item.channel) {
        let message = globalContent.messages.find(message => message.ts === event.item.ts);
        if (message) {
          console.log(`Text of Message Reaction Added to: ${message.text}`);
          if (!message.reactions) {
            message.reactions = [{name: event.reaction, count: 1}];
          } else {
            let oldReaction = message.reactions.find(reaction => reaction.name === event.reaction);
            if (oldReaction) {
              oldReaction.count += 1;
            } else {
              message.reactions.push({name: event.reaction, count: 1});
            }
          }
          changed = true;
        } else {
          console.log('Message which reaction is added could not be found');
        }
      }
      break;
    case 'reaction_removed':
      if (globalContent.slackData.channel.id === event.item.channel) {
        let message = globalContent.messages.find(message => message.ts === event.item.ts);
        if (message) {
          console.log(`Text of Message Reaction Removed from: ${message.text}`);
          if (message.reactions) {
            let oldReaction = message.reactions.find(reaction => reaction.name === event.reaction);
            if (oldReaction) {
              oldReaction.count -= 1;
              changed = true;
            }
          }
        } else {
          console.log('Message which reaction is removed could not be found');
        }
      }
      break;
    case 'emoji_changed':
      break;
  }
  if (!changed) return;
  globalContent.filteredMessages = filterMessages(globalContent.messages, globalContent.slackData.showApps, globalContent.slackData.allUsers, globalContent.selectedUserIds);
  globalContent.data = setProfiles(processMessages(globalContent.filteredMessages), globalContent.bots, globalContent.users);
  globalCount++;
}