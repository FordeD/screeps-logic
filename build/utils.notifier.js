module.exports = {
  dangerNotify: function(username, roomName) {
    Game.notify(`User ${username} spotted in room ${roomName}`);
  },
  wrongNotify: function(object, error) {
    Game.notify(`Object ${object} return with error: ${error}`);
  },
  infoNotify: function(object, text) {
    Game.notify(`INFO ${object} : ${text}`);
  },
  writeLog: function(type, data) {
    switch(type) {
      case LOG_TYPES.DEV: {
        console.log(data);
        break;
      }
      case LOG_TYPES.ACTION: {
        console.log('Actor: '+data.actor+' '+data.text);
        break;
      }
      case LOG_TYPES.STATISTIC: {
        console.log('STATISTIC: '+data.text);
        break;
      }
    }
  }
}