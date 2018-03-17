module.exports = {
  dangerNotify: function(username, roomName) {
    Game.notify(`User ${username} spotted in room ${roomName}`);
  },
  cpuNotify: function(spawnObj) {
    let used = Game.cpu.getUsed();
    if(!spawnObj.memory.USED_CPU) {
      spawnObj.memory.USED_CPU = 0;
    }
    spawnObj.memory.USED_CPU += used;

    if(!spawnObj.memory.MAX_USED_CPU) {
      spawnObj.memory.MAX_USED_CPU = 0;
    }
    if(used > spawnObj.memory.MAX_USED_CPU) {
      spawnObj.memory.MAX_USED_CPU = used;
    }
    let currTime = Game.time;
    if(!spawnObj.memory.CPU_NOTIFY_TIME) {
      spawnObj.memory.CPU_NOTIFY_TIME = 0;
    }
    if(!CPU_NOTIFY_TIME == 0 || currTime - spawnObj.memory.CPU_NOTIFY_TIME > NOTIFY_TIMER_COUNT.CPU ) {
      spawnObj.memory.AVERAGE_USED_CPU = USED_CPU / NOTIFY_TIMER_COUNT.CPU;
      spawnObj.memory.USED_CPU = 0;
      this.infoNotify('CPU', 'Max used:'+spawnObj.memory.MAX_USED_CPU+'. Average used:'+spawnObj.memory.AVERAGE_USED_CPU+'. Used in 100 ticks:'+spawnObj.memory.MAX_USED_CPU);
      this.writeLog(LOG_TYPES.DEV, 'INFO CPU : Max used:'+spawnObj.memory.MAX_USED_CPU+'. Average used:'+spawnObj.memory.AVERAGE_USED_CPU+'. Used in 100 ticks:'+spawnObj.memory.MAX_USED_CPU);
      spawnObj.memory.CPU_NOTIFY_TIME = currTime;
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