module.exports = {
  processing: function(room, hostles, solders) {
    let hostiles = hostles[0];
    let roomName = room.name;
    var userName = hostiles[0].owner;
    notifier.dangerNotify(userName, roomName, hostles.count);
    solders.forEach(creep => this.solderDefend(creep, hostile));
    return true;
  },

  solderDefend: function(creep, hostile) {
    if(creep.room.name == creep.memory.target) {
      target = creep.pos.findClosestByPath(hostile);
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
    return true;
  },

  saveWorkCreeps: function(spawn, creeps) {
    creeps.forEach(creep => creep.moveTo(spawn, CREEP_MOVE_LINE));
    return true;
  }
}