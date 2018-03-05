var defendController = require('defend.controller');

module.exports = {
  processing : function() {
    for(name in Game.spawns) {
      let room = Game.spawns[name].room;
      defendController.processing(room);
    }
  }
};