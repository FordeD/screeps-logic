var HOSLILES = null;
const CREEP_MOVE_ATACK       = {visualizePathStyle: {stroke: '#ee6a50'}};
const CREEP_MOVE_LINE        = {visualizePathStyle: {stroke: '#ffffff'}};

module.exports = {
  processing: function(room, hostles, solders) {
    HOSLILES = hostles;
    let roomName = room.name;
    var username = HOSLILES[0].owner;
    Game.notify(`User ${username} spotted in room ${roomName}`);
    var towers = room.find(
        FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    towers.forEach(tower => tower.attack(HOSLILES[0]));
    solders.forEach(creep => this.solderDefend(creep));
  },

  solderDefend: function(creep) {
    if(creep.room.name == creep.memory.target) {
      target = creep.pos.findClosestByPath(HOSTLES[0])
      if(target) {
        result = creep.attack(target)
        if(result == ERR_NOT_IN_RANGE){
          creep.moveTo(target, CREEP_MOVE_ATACK)
        }
      }
    } else {
        var route = Game.map.findRoute(creep.room, creep.memory.target)
        if(route.length > 0) {
          creep.moveTo(creep.pos.findClosestByRange(route[0].exit), CREEP_MOVE_LINE)
        }
    }
  }
}