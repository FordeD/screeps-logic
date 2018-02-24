module.exports = {
  checkMemory : function() {
    this.checkCreepsMemory();
  },

  checkCreepsMemory : function() {
    for(var name in Memory.creeps) {
      var creep = Game.creeps[name];
      if(!creep) {
        console.log('Remove empty creep data '+name);
        delete Memory.creeps[name];
      }   
    }
  }
};