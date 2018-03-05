var HOSLILES = null;

module.exports = {
  processing: function(room, hostles, solders) {
    let roomName = room.name;
    solders.forEach(creep => this.solderDefend(creep));
  },

  solderAtack: function(creep) {
      target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
      if(!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES)
      }
      if(target) {
        result = creep.attack(target)
        if(result == ERR_NOT_IN_RANGE){
          creep.moveTo(target, CREEP_MOVE_ATACK)
        }
      }
      //  else {
      //   creep.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]))
      // }
      // var route = Game.map.findRoute(creep.room, creep.memory.target)
      // if(route.length > 0) {
      //   creep.moveTo(creep.pos.findClosestByRange(route[0].exit), CREEP_MOVE_LINE)
      // }
  }
}