var HOSTILES = null;
const CREEP_MOVE_ATACK       = {visualizePathStyle: {stroke: '#ee6a50'}};
const CREEP_MOVE_LINE        = {visualizePathStyle: {stroke: '#ffffff'}};

module.exports = {
  processing: function(room, hostles, solders, helpers) {
    HOSTILES = hostles;
    let roomName = room.name;
    var username = HOSTILES[0].owner;
    Game.notify(`User ${username} spotted in room ${roomName}`);
    solders.forEach(creep => this.solderDefend(creep));
    helpers.forEach(creep => this.solderDefend(creep));
  },

  solderDefend: function(creep) {
    if(creep.room.name == creep.memory.target) {
      target = creep.pos.findClosestByPath(HOSTILES[0]);
      if(target) {
        if(creep.memory.role == 'solder') {
          if(creep.attack(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target, CREEP_MOVE_ATACK);
          }
        } else {
          if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target, CREEP_MOVE_ATACK);
          }
        }
      }
    } else {
        var route = Game.map.findRoute(creep.room, creep.memory.target);
        if(route.length > 0) {
          creep.moveTo(creep.pos.findClosestByRange(route[0].exit), CREEP_MOVE_LINE);
        }
    }
  }
}