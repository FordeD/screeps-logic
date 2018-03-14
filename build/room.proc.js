module.exports = {
  processing : function() {
    for(name in Game.spawns) {
      let spawn = Game.spawns[name];
      let roomName = spawn.room.name;
      if(!roomControllers[roomName]) {
        let controller = require('room.controller');
        roomControllers[roomName] = controller;
      }
      var controllerSpawn = roomControllers[roomName].getSpawn();
      if(!controllerSpawn) {
        roomControllers[roomName].processing(spawn);
      } else {
        roomControllers[roomName].processing();
      }
    }
  }
};