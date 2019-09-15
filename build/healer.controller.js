module.exports = {
  processing: function(creep, controller) {
    var SPAWN_OBJ = controller.getSpawn();
    var SPAWN_MEMORY = controller.getMemory();
    if (creep.room.name == creep.memory.target) {
      var hittedCreep = creep.pos.findClosestByRange(FIND_CREEPS, {
        filter: (creep) => {
          return creep.hits < creep.hitsMax;
        }
      });
      if (hittedCreep) {
        creep.heal(hittedCreep);
      } else {
        if (creep.pos.x > 45 || creep.pos.Y > 45 || creep.pos.x < 5 || creep.pos.y < 5) {
          creep.moveTo(SPAWN_OBJ, SPAWN_MEMORY.CREEP_MOVE_LINE);
        } else {
          creep.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]));
        }
      }
    } else {
      var route = Game.map.findRoute(creep.room, creep.memory.target);
      if (route.length > 0) {
        creep.moveTo(creep.pos.findClosestByRange(route[0].exit), SPAWN_MEMORY.CREEP_MOVE_LINE);
      }
    }
  }
}