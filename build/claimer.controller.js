module.exports = {
  processing: function (creep, controller) {
    var SPAWN_ROOM = controller.getRoom();
    var SPAWN_MEMORY = controller.getMemory();
    var NEAR_ROOMS = controller.getNearRooms();

    if (!creep.memory.targetRoom) {
      var claimers = _.filter(CREEPS, (creep) => creep.memory.role == SPAWN_MEMORY.ROLES.claimer);

      for (var index in NEAR_ROOMS) {
        var roomName = NEAR_ROOMS[index];
        var emptyRoom = _.filter(claimers, (creep) => creep.memory.targetRoom == roomName);
        if (emptyRoom.length <= 1) {
          creep.memory.targetRoom = roomName;
          break;
        }
      }
    } else {
      if (creep.room.name == SPAWN_ROOM.name) {
        var exitDirection = Game.map.findExit(SPAWN_ROOM, creep.memory.targetRoom);
        var route = creep.pos.findClosestByRange(exitDirection);
        creep.moveTo(route);
      } else {
        if (creep.room.controller && !creep.room.controller.my) {
          if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
          }
        }
      }
    }
  }
}