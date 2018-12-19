const mockData = {
  content: { 
    slackData: {
      channel: {id: 'CEN740MHD', name: 'denemechannel'},
      allUsers: true,
      allBots: false,
      users: [
        {id: "UEBD1P7S4", name: ''},
        {id: "UEBQHC0E7", name: ''},
        {id: "UEDA88DSS", name: ''},
        {id: 'UEH8HN4AU', name: ''}
      ],
      bots: [
        {id: 'BEPF0F61H', name: ''}
      ]
    }
  },
  orientation: 'horizontal',
  user: { 
    slackAccessToken: ''
  },
  port: 8001
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