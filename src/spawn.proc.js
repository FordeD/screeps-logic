var spavnController = require('spawn.controller');

module.exports = {
  processing : function() {
    for(name in Game.spawns) {
      let spawn = Game.spawns[name];
      spavnController.processing(spawn);
    }
  }
};