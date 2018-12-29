const mockData = {
  content: {
    _id: '5c24b2e8e7e4540639466d99',
    slackData: {
      channel: {id: 'CEN740MHD', name: 'general'},
      allUsers: true,
      users: [
        {id: "UEBD1P7S4", name: ''},
        {id: "UEBQHC0E7", name: ''},
        {id: "UEDA88DSS", name: ''},
        {id: 'UEH8HN4AU', name: ''}
      ],
      showApps: true
    }
  },
  orientation: 'horizontal',
  user: {
    slackTeamId: ''
  },
  port: 8001
};

export default mockData;
  
/*
  orientation: <string> 'horizontal' | 'vertical'
  content: <object>
  user: {
    googleCalendarToken : <string>
  }
  port: <number>
*/