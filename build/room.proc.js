module.exports = {
  processing : function() {
    for(name in Game.spawns) {
      let spawn = Game.spawns[name];
      let roomName = spawn.room.name;
      if(!roomControllers[roomName]) {
        let controller = require('room.controller');
        roomControllers[roomName] = controller;
      }
      roomControllers[roomName].processing(spawn);
    }
  }
};