var Spawn_1 = require('spawn1.controller');

module.exports = {
  processing : function() {
    if(Game.spawns.Spawn1) {
      Spawn_1.processing(Game.spawns.Spawn1);
    } 
  }
};