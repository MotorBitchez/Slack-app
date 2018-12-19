
let data = [
  {
    id: 'sinan',
    text: 'selam',
    ts: 123456
  },
  {
    id: 'sinan',
    text: 'selam',
    ts: 123457
  },
  {
    id: 'sinan',
    text: 'selam',
    ts: 123456
  },
  {
    id: 'sinan',
    text: 'selam',
    ts: 123457
  },
  {
    id: 'hakan',
    text: 'selam',
    ts: 123488
  },
  {
    id: 'hakan',
    text: 'selam',
    ts: 123488
  },
  {
    id: 'sinan',
    text: 'selam',
    ts: 123600
  }
];

let messages = [];
// {id, timestamp, texts: [text]}
let lastAddedIndex = -1;
data.forEach((message, idx) => {
  if (idx === 0) {
    messages.push({id: message.id, texts:[{ts: message.ts, text: message.text}] });
    lastAddedIndex += 1;
  } else {
    if (messages[lastAddedIndex].id === message.id) {
      messages[lastAddedIndex].texts.push({ts: message.ts, text: message.text});
    } else {
      messages.push({id: message.id, texts:[{ts: message.ts, text: message.text}] });
      lastAddedIndex += 1;
    }
  }
});
console.log(data);
console.log(messages);


messages.map(message => 
<Message id={message.id}>
  {message.texts[0].ts}
  {message.texts.map(text => <span>{text.text}</span>)}
</Message>
  )