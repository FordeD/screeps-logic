module.exports = {
  checkMemory: function () {
    this.checkCreepsMemory();
    this.checkFlagsMemory();
  },

  checkCreepsMemory: function () {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        console.log('Remove empty creep data ' + name);
        delete Memory.creeps[name];
      }
    }
  },

  checkFlagsMemory: function () {
    for (var name in Memory.flags) {
      if (!Game.flags[name]) {
        console.log('Remove empty flag data ' + name);
        delete Memory.flags[name];
      }
    }
  }
};