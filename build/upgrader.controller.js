module.exports = {
  movements: require('./creep.movements'),
  processing: function (creep, controller) {
    var SPAWN_ROOM = controller.getRoom();
    var SPAWN_OBJ = controller.getSpawn();
    var NEAR_ROOMS = controller.getNearRooms();
    var WORK_CREEPS = controller.getWorkers();
    var STORAGES = controller.getStorages();
    var SOURCES = controller.getSources();
    var CREEPS = controller.getCreeps();
    var SPAWN_MEMORY = controller.getMemory();

    var total = _.sum(creep.carry);
    if (total == 0) {
      creep.memory.isTransfer = false;
    }

    if (total < creep.carryCapacity && !creep.memory.isTransfer) {
      let anyRooms = this.movements.creepGetEnergy(creep, SPAWN_ROOM, SPAWN_OBJ, NEAR_ROOMS, WORK_CREEPS, STORAGES, SOURCES, CREEPS);
      if (Array.isArray(anyRooms)) {
        return anyRooms;
      }
      if (!anyRooms) {
        return;
      }
    }

    if (total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      creep.memory.sourceId = null;
    }

    if (creep.memory.isTransfer) {
      if (SPAWN_ROOM.controller) {
        var res = creep.upgradeController(SPAWN_ROOM.controller);
        if (res == ERR_NOT_IN_RANGE) {
          creep.moveTo(SPAWN_ROOM.controller, SPAWN_MEMORY.CREEP_MOVE_LINE);
        }
      }
      if (creep.carry.energy == 0) {
        creep.memory.isTransfer = false;
      }
    }
  }
}