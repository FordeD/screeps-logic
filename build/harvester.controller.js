module.exports = {
  movements: require('./creep.movements'),
  processing: function (creep, controller) {
    var SPAWN_ROOM = controller.getRoom();
    var SPAWN_OBJ = controller.getSpawn();
    var SPAWN_MEMORY = controller.getMemory();
    var NEAR_ROOMS = controller.getNearRooms();
    var WORK_CREEPS = controller.getWorkers();
    var STORAGES = controller.getStorages();
    var SOURCES = controller.getSources();
    var CREEPS = controller.getCreeps();

    var total = _.sum(creep.carry);

    if (total == 0) {
      creep.memory.isTransfer = false;
    }

    if (total < creep.carryCapacity && !creep.memory.isTransfer) {
      if (!creep.memory.sourceId) {
        this.movements.creepGetEnergy(creep, SPAWN_ROOM, SPAWN_OBJ, NEAR_ROOMS, WORK_CREEPS, STORAGES, SOURCES, CREEPS)
        return;
      } else {
        var source = Game.getObjectById(creep.memory.sourceId);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          // creep.moveTo(source, SPAWN_MEMORY.CREEP_MOVE_LINE);
          if (creep.moveTo(source, { noPathFinding: true, visualizePathStyle: SPAWN_MEMORY.CREEP_HARVEST_LINE }) == ERR_NOT_FOUND) {
            if (creep.moveTo(source, { reusePath: 100, visualizePathStyle: SPAWN_MEMORY.CREEP_HARVEST_LINE }) != OK) {
              creep.moveTo(25, 25, { visualizePathStyle: SPAWN_OBJ.memory.CREEP_HARVEST_LINE });
            }
          }
        }
        return;
      }
    }

    if (total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      // creep.memory.sourceId = null;
      creep.memory.goneRoom = false;
    }

    var currTransfer = Game.getObjectById(creep.memory.isTransfer);
    if (creep.room.name != SPAWN_ROOM.name) {
      creep.memory.goneRoom = SPAWN_ROOM.name;
      if (creep.room.name == SPAWN_ROOM.name || creep.room.name != creep.memory.goneRoom) {
        var exitDirection = Game.map.findExit(creep.room.name, SPAWN_ROOM.name);
        var route = creep.pos.findClosestByRange(exitDirection);
        // creep.moveTo(route);
        if (creep.moveTo(route, { noPathFinding: true, visualizePathStyle: SPAWN_MEMORY.CREEP_EXIT_LINE }) == ERR_NOT_FOUND) {
          let moveResult = creep.moveTo(route, { reusePath: 50, visualizePathStyle: SPAWN_OBJ.memory.CREEP_EXIT_LINE });
          if (moveResult != OK) {
            creep.moveTo(25, 25, { visualizePathStyle: SPAWN_OBJ.memory.CREEP_EXIT_LINE });
          }
        }

      } else {
        if (creep.pos.x == 0 || creep.pos.y == 0 || creep.pos.x == 49 || creep.pos.y == 49) {
          creep.moveTo(25, 25, { visualizePathStyle: SPAWN_OBJ.memory.CREEP_EXIT_LINE });
        }
        let source = this.getFreeSource(creep, true);
      }
    } else {
      if (creep.memory.isTransfer == true) {
        var store = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (obj) => {
            return (obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE) && obj.store[RESOURCE_ENERGY] < obj.storeCapacity;
          }
        });

        var extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
          filter: (obj) => {
            return obj.structureType == STRUCTURE_EXTENSION && obj.energy < obj.energyCapacity
          }
        });

        var withoutEnergyStructures = [
          SPAWN_OBJ.energy < SPAWN_OBJ.energyCapacity ? SPAWN_OBJ : false,
          CREEPS.length >= SPAWN_MEMORY.SPAWN_QUEUE_MAX - 2 ? store : extension,
          creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (obj) => {
              if (obj.structureType == STRUCTURE_TOWER) {
                return obj.energy < obj.energyCapacity;
              }
              return false;
            }
          }),
          CREEPS.length >= SPAWN_MEMORY.SPAWN_QUEUE_MAX - 2 ? extension : store
        ];

        var goneTransfer = false;
        for (index in withoutEnergyStructures) {
          var obj = withoutEnergyStructures[index];
          if (obj) {
            goneTransfer = true;
            if (creep.transfer(obj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(obj, { reusePath: 25, visualizePathStyle: SPAWN_OBJ.memory.CREEP_TO_SPAWN_LINE });
              creep.memory.isTransfer = obj.id;
              creep.memory.goneRoom = false;
            }
            break;
          }
        }
      } else {
        switch (creep.transfer(currTransfer, RESOURCE_ENERGY)) {
          case ERR_NOT_IN_RANGE: {
            creep.moveTo(currTransfer, SPAWN_MEMORY.CREEP_MOVE_LINE);
            break;
          }
          case OK: {
            creep.memory.putTuStorage = currTransfer.structureType == STRUCTURE_STORAGE || currTransfer.structureType == STRUCTURE_CONTAINER ? true : false;
            creep.memory.goneRoom = false;
          }
          case ERR_FULL:
          case ERR_INVALID_TARGET: {
            creep.memory.isTransfer = true;
          }
        }
      }
    }
  }
}