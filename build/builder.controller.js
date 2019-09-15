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
    var total = _.sum(creep.carry);

    if (total == 0) {
      creep.memory.isTransfer = false;
      creep.memory.isBuilding = false;
    }

    if (total < creep.carryCapacity && !creep.memory.isTransfer && !creep.memory.isBuilding) {
      if (!this.movements.creepGetEnergy(creep, SPAWN_ROOM, SPAWN_OBJ, NEAR_ROOMS, WORK_CREEPS, STORAGES, SOURCES, CREEPS)) {
        return;
      }
    }

    if (total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      creep.memory.sourceId = null;
    }

    var structures = [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE, STRUCTURE_CONTAINER, STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_ROAD];
    for (var index = 0; index < structures.length; index++) {
      var res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, { filter: { structureType: structures[index] } });
      if (res) {
        creep.memory.isBuilding = true;
        creep.memory.exTarget = res.id;
        break;
      }
    }

    if (creep.memory.exTarget) {
      var target = Game.getObjectById(creep.memory.exTarget);//Game.constructionSites[cr.memory.exTarget];
      if (target) {
        if (target.progress < target.progressTotal) {
          var res = creep.build(target);
          if (res == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, SPAWN_OBJ.memory.CREEP_MOVE_LINE);
          }
        } else {
          creep.memory.exTarget = null;
        }
      } else {
        creep.memory.exTarget = null;
      }
    } else {
      creep.memory.isBuilding = false;
    }
  },

  setBuilderTarger: function (creep, controller) {
    var SPAWN_MEMORY = controller.getMemory();
    var structures = [STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_RAMPART];
    for (var index = 0; index < structures.length; index++) {
      var res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, { filter: { structureType: structures[index] } });
      if (res) {
        creep.memory.isBuilding = true;
        creep.memory.exTarget = res.id;
        break;
      }
    }

    if (!creep.memory.exTarget) {
      let repairStructure = [];
      let state = controller.getState();
      repairStructure = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.hits < state == SPAWN_MEMORY.ROOM_STATES.DEFEND ? 650 : structure.hitsMax && structure.hits > 0);
        }
      });

      if (repairStructure.length > 0) {
        creep.memory.isBuilding = true;
        creep.memory.exTarget = repairStructure[0].id;
      } else {
        creep.memory.isBuilding = false;
        creep.memory.isTransfer = true;
      }
    }
  },
}