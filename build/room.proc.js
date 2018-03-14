module.exports = {
  processing : function() {
    for(name in Game.spawns) {
      let spawn = Game.spawns[name];
      if(!roomControllers[name]) {
        let controller = require('room.controller');
        roomControllers[name] = controller;
      }
      var controllerSpawn = roomControllers[name].getSpawn();
      if(!controllerSpawn) {
        roomControllers[name].processing(spawn);
      } else {
        roomControllers[name].processing();
      }
    }
  }
};