var Spawn_1 = require('spawn1_controller');

module.exports = {
  processing : function() {
    if(Game.spawns.Spawn1) {
      Spawn_1.processing();
    } 
  }
};