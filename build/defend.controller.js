module.exports = {
  processing: function(room, hostles, solders) {
    let hostile = hostles[0];
    let roomName = room.name;
    var userName = hostile.owner;
    notifier.dangerNotify(userName, roomName, hostles.length);
    solders.forEach(creep => this.solderDefend(creep, hostile));
    return true;
  },

  solderDefend: function(creep, hostile) {
    if(creep.room.name == creep.memory.target) {
      if(creep.memory.role == ROLES.solder) {
        if(creep.attack(hostile) == ERR_NOT_IN_RANGE){
          creep.moveTo(hostile, CREEP_MOVE_ATACK);
        }
        return;
      } else {
        if(creep.rangedAttack(hostile) == ERR_NOT_IN_RANGE){
          creep.moveTo(hostile, CREEP_MOVE_ATACK);
        }
        return;
      }
    } else {
        var route = Game.map.findRoute(creep.room, creep.memory.target);
        if(route.length > 0) {
          creep.moveTo(creep.pos.findClosestByRange(route[0].exit), CREEP_MOVE_LINE);
        }
    }
    return true;
  },

  saveWorkCreeps: function(spawn, creeps) {
    creeps.forEach(creep => creep.moveTo(spawn, CREEP_MOVE_LINE));
    return true;
  }
}