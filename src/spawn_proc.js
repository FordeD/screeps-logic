var Spawn1 = require('spawn1_controller');

module.exports = {
  processing : function() {
      if(Game.spawns.Spawn1) {
        Spawn1.processing();
      }
      
  }
};