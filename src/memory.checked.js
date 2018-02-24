module.exports = {
  checkMemory : function() {
    this.checkCreepsMemory();
  },

  checkCreepsMemory : function() {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        console.log('Remove empty creep data '+name);
        delete Memory.creeps[name];
      }   
    }
  }
};