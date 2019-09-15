module.exports = {
  processing: function (room, hostles, solders, SPAWN_MEMORY) {
    let roomName = room.name;
    notifier.dangerNotify('Other creeps', roomName, hostles.length);
    solders.forEach(creep => this.solderDefend(creep, hostles, SPAWN_MEMORY));
    return true;
  },

  solderDefend: function (creep, hostles, SPAWN_MEMORY) {
    if (creep.room.name == creep.memory.target) {
      var healers = _.filter(hostles, (hostle) => hostle.body.findIndex(e => e == HEAL) > 0);
      let hostile = false;
      if (healers.length > 0) {
        hostile = healers[0];
      } else {
        hostile = hostles[0];
      }
      switch (creep.memory.role) {
        case SPAWN_MEMORY.ROLES.solder: {
          if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, SPAWN_MEMORY.CREEP_MOVE_ATACK);
          }
          break;
        }
        case SPAWN_MEMORY.ROLES.ranger: {
          if (creep.rangedAttack(hostile) == ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, SPAWN_MEMORY.CREEP_MOVE_ATACK);
          }
          break;
        }
        case SPAWN_MEMORY.ROLES.healer: {
          var hittedCreep = creep.pos.findClosestByRange(FIND_CREEPS, {
            filter: (creep) => {
              return creep.hits < creep.hitsMax;
            }
          });
          if (hittedCreep) {
            creep.heal(hittedCreep);
          }
          break;
        }
      }
    } else {
      var route = Game.map.findRoute(creep.room, creep.memory.target);
      if (route.length > 0) {
        creep.moveTo(creep.pos.findClosestByRange(route[0].exit), SPAWN_MEMORY.CREEP_MOVE_LINE);
      }
    }
    return true;
  },

  saveWorkCreeps: function (spawn, creeps, SPAWN_MEMORY) {
    creeps.forEach(creep => {
      if (_.sum(creep.carry) > 0) {
        var tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (obj) => {
            if (obj.structureType == STRUCTURE_TOWER) {
              return obj.energy < obj.energyCapacity;
            }
            return false;
          }
        });
        if (tower) {
          if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(tower, SPAWN_MEMORY.CREEP_MOVE_LINE);
          }
        }
      } else {
        creep.moveTo(spawn, SPAWN_MEMORY.CREEP_MOVE_LINE);
      }
    });
    return true;
  }
}
