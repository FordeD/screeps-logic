module.exports = {
  dangerNotify: function(username, roomName) {
    Game.notify(`User ${username} spotted in room ${roomName}`);
  },
  cpuNotify: function() {
    let used = Game.cpu.getUsed();
    USED_CPU += used;
    if(used > MAX_USED_CPU) {
      MAX_USED_CPU = used;
    }
    if(!CPU_NOTIFY_TIME == 0 || currTime - CPU_NOTIFY_TIME > NOTIFY_TIMER_COUNT.CPU ) {
      let AVERAGE_USED_CPU = USED_CPU / NOTIFY_TIMER_COUNT.CPU;
      USED_CPU = 0;
      this.infoNotify('CPU', 'Max used:'+MAX_USED_CPU+'. Average used:'+AVERAGE_USED_CPU+'. Used in 100 ticks:'+MAX_USED_CPU);
    }
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