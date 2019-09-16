module.exports = {
  dangerNotify: function (username, roomName) {
    Game.notify(`User ${username} spotted in room ${roomName}`);
  },
  cpuNotify: function (spawnObj) {
    let used = Game.cpu.getUsed();
    if (!spawnObj.memory.USED_CPU) {
      spawnObj.memory.USED_CPU = 0;
    }
    spawnObj.memory.USED_CPU += used;

    if (!spawnObj.memory.MAX_USED_CPU) {
      spawnObj.memory.MAX_USED_CPU = 0;
    }
    if (used > spawnObj.memory.MAX_USED_CPU) {
      spawnObj.memory.MAX_USED_CPU = used;
    }
    if (!spawnObj.memory.CPU_NOTIFY_TIME) {
      spawnObj.memory.CPU_NOTIFY_TIME = 0;
    }
    let currTime = Game.time;
    spawnObj.memory.AVERAGE_USED_CPU = spawnObj.memory.USED_CPU / spawnObj.memory.NOTIFY_TIMER_COUNT.CPU;
    spawnObj.memory.USED_CPU = 0;
    console.log(spawnObj.memory.CPU_NOTIFY_TIME, spawnObj.memory.CPU_NOTIFY_TIME - currTime);
    if (spawnObj.memory.CPU_NOTIFY_TIME - currTime <= 0) {
      this.infoNotify(spawnObj, 'CPU', 'Max used: ' + spawnObj.memory.MAX_USED_CPU + '. Average used: ' + spawnObj.memory.AVERAGE_USED_CPU + '. Used in 100 ticks: ' + spawnObj.memory.MAX_USED_CPU);
      spawnObj.memory.CPU_NOTIFY_TIME = currTime + spawnObj.memory.NOTIFY_TIMER_COUNT.CPU;
    }
  },
  wrongNotify: function (object, error) {
    Game.notify(`Object ${object} return with error: ${error}`);
  },
  infoNotify: function (spawnObj, object, text) {
    Game.notify(`INFO ${object} : ${text}`);
    this.writeLog(spawnObj, spawnObj.memory.LOG_TYPES.DEV, `INFO ${object} : ${text}`);
  },
  writeLog: function (spawnObj, type, data) {
    switch (type) {
      case spawnObj.memory.LOG_TYPES.DEV: {
        console.log(data);
        break;
      }
      case spawnObj.memory.LOG_TYPES.ACTION: {
        console.log('Actor: ' + data.actor + ' ' + data.text);
        break;
      }
      case spawnObj.memory.LOG_TYPES.STATISTIC: {
        console.log('STATISTIC: ' + data.text);
        break;
      }
    }
  }
}