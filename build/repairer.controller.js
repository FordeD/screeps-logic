module.exports = {
  movements: require('./creep.movements'),
  processing: function (creep, controller, CONTROLLER_LEVEL) {
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
      if (!this.movements.creepGetEnergy(creep, SPAWN_ROOM, SPAWN_OBJ, NEAR_ROOMS, WORK_CREEPS, STORAGES, SOURCES, CREEPS)) {
        return;
      }
    }

    if (total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      creep.memory.sourceId = null;
    }

    if (creep.memory.isTransfer) {
      if (creep.memory.exTarget) {
        var target = Game.getObjectById(creep.memory.exTarget);//Game.constructionSites[cr.memory.exTarget];
        if (this.checkRepairedStructure(target, controller)) {
          if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, SPAWN_MEMORY.CREEP_MOVE_LINE);
          }
        } else {
          creep.memory.exTarget = null;
          creep.memory.isRepair = false;
          return;
        }
      } else {
        var repairStructure = [
          creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.hits < 1000 && structure.hits >= 0 && structure.structureType != STRUCTURE_WALL;
            }
          }),
          creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
              return structure.hits < SPAWN_MEMORY.WALL_HITS_MAX[CONTROLLER_LEVEL] && structure.hits > 0 && structure.structureType == STRUCTURE_WALL;
            }
          })
        ];

        var goneRepair = false;
        for (index in repairStructure) {
          var obj = repairStructure[index];
          if (obj) {
            creep.memory.exTarget = obj.id;
            goneRepair = true;
            break;
          }
        }

        if (!goneRepair) {
          res = SPAWN_ROOM.find(FIND_STRUCTURES, {
            filter: (obj) => {
              if (obj.structureType == STRUCTURE_TOWER) {
                return obj.energy < obj.energyCapacity;
              }
              return false;
            }
          });
          if (res.id) {
            if (creep.transfer(res, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(res, SPAWN_MEMORY.CREEP_MOVE_LINE);
            }
            return;
          } else {
            creep.memory.isRepair = false;
          }
        }
      }
    }
  },

  checkRepairedStructure: function (target, controller) {
    var SPAWN_MEMORY = controller.getMemory();

    if (target) {
      if (((target.structureType == STRUCTURE_WALL) || (target.structureType == STRUCTURE_RAMPART)) && target.hits < SPAWN_MEMORY.WALL_HITS_MAX[CONTROLLER_LEVEL]) {
        return true;
      } else if (target.structureType != STRUCTURE_EXTENSION && target.hits < target.hitsMax) {
        return true;
      } else if (target.structureType != STRUCTURE_WALL && (target.hits < 2000 || target.hits < target.hitsMax)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}