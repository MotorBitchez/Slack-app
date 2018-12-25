const part1 = 'x|o';
const part8 = 'c1|dc|9d|7|a9';
const part2 = 'x|p|-';
const part6 = '53|64-5|7db|1db9';
const part7 = '275|18a70|886|8117';
const part4 = '72-48|783|3408';
const part5 = '48|3-50|9692|00';
const part3 = '487|766|21|83';

const mockData = {
  content: {
    slackData: {
      channel: {id: 'CEBQHCAEP', name: 'general'},
      allUsers: true,
      allBots: true,
      users: [
        {id: "UEBD1P7S4", name: ''},
        {id: "UEBQHC0E7", name: ''},
        {id: "UEDA88DSS", name: ''},
        {id: 'UEH8HN4AU', name: ''}
      ],
      bots: [

      ],
      showApps: true
    }
  },
  orientation: 'horizontal',
  user: {
    slackAccessToken: getToken(`${part1}${part2}${part3}${part4}${part5}${part6}${part7}${part8}`)
  },
  port: 8001
};

function getToken(token){
  while (token.includes('|')) {
    token = token.replace('|', '');
  }
  return token;
}

export default mockData;
  
/*
  orientation: <string> 'horizontal' | 'vertical'
  content: <object>
  user: {
    googleCalendarToken : <string>
  }
  port: <number>
*/