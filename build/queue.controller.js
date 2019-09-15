module.exports = {
  addHarvester: function (spawnObj, roomName, creepLevel, spawnName, creepsLevel) {
    var minLevel;
    for (index in spawnObj.memory.MIN_SPAWN_ENERGY) {
      if (spawnObj.memory.MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = index;
      }
    }
    if (!minLevel) {
      minLevel = creepsLevel;
    }
    if (spawnObj.memory.SPAWN_QUEUE.length < spawnObj.memory.SPAWN_QUEUE_MAX) {
      spawnObj.memory.SPAWN_QUEUE.push({ body: spawnObj.memory.HARVESTER_BODY[minLevel], memory: { role: spawnObj.memory.ROLES.harvester, isTransfer: false, owner: spawnName, goneRoom: null } });
      notifier.infoNotify(spawnObj, spawnName, "Add to queue a harvester. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
    }
  },

  addUpgrader: function (spawnObj, roomName, creepLevel, spawnName, creepsLevel) {
    var minLevel;
    for (index in spawnObj.memory.MIN_SPAWN_ENERGY) {
      if (spawnObj.memory.MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = index;
      }
    }
    if (!minLevel) {
      minLevel = creepsLevel;
    }
    if (spawnObj.memory.SPAWN_QUEUE.length < spawnObj.memory.SPAWN_QUEUE_MAX) {
      spawnObj.memory.SPAWN_QUEUE.push({ body: spawnObj.memory.CL_UPGRADER_BODY[minLevel], memory: { role: spawnObj.memory.ROLES.upgrader, isTransfer: false, owner: spawnName, goneRoom: null } });
      notifier.infoNotify(spawnObj, spawnName, "Add to queue a cl_upgrader. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
    }
  },

  addBuilder: function (spawnObj, roomName, creepLevel, spawnName, creepsLevel) {
    var minLevel;
    for (index in spawnObj.memory.MIN_SPAWN_ENERGY) {
      if (spawnObj.memory.MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = index;
      }
    }
    if (!minLevel) {
      minLevel = creepsLevel;
    }
    if (spawnObj.memory.SPAWN_QUEUE.length < spawnObj.memory.SPAWN_QUEUE_MAX) {
      spawnObj.memory.SPAWN_QUEUE.push({ body: spawnObj.memory.EX_BUILDER_BODY[minLevel], memory: { role: spawnObj.memory.ROLES.builder, isTransfer: false, isBuilding: false, owner: spawnName, goneRoom: null } });
      notifier.infoNotify(spawnObj, spawnName, "Add to queue a ex_builder. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
    }
  },

  addRepairer: function (spawnObj, roomName, creepLevel, spawnName, creepsLevel) {
    var minLevel;
    for (index in spawnObj.memory.MIN_SPAWN_ENERGY) {
      if (spawnObj.memory.MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = index;
      }
    }
    if (!minLevel) {
      minLevel = creepsLevel;
    }
    if (spawnObj.memory.SPAWN_QUEUE.length < spawnObj.memory.SPAWN_QUEUE_MAX) {
      spawnObj.memory.SPAWN_QUEUE.push({ body: spawnObj.memory.REPAIRER_BODY[minLevel], memory: { role: spawnObj.memory.ROLES.repairer, isTransfer: false, isRepair: false, target: roomName, owner: spawnName, goneRoom: null } });
      notifier.infoNotify(spawnObj, spawnName, "Add to queue a repairer. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
    }
  },

  addSolder: function (spawnObj, roomName, creepLevel, spawnName, creepsLevel) {
    var minLevel;
    for (index in spawnObj.memory.MIN_SPAWN_ENERGY) {
      if (spawnObj.memory.MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = index;
      }
    }
    if (!minLevel) {
      minLevel = creepsLevel;
    }
    if (spawnObj.memory.SPAWN_QUEUE.length < spawnObj.memory.SPAWN_QUEUE_MAX) {
      spawnObj.memory.SPAWN_QUEUE.push({ body: spawnObj.memory.SOLDER_BODY[minLevel], memory: { role: spawnObj.memory.ROLES.solder, target: roomName, owner: spawnName, goneRoom: null } });
      notifier.infoNotify(spawnObj, spawnName, "Add to queue a solder. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
    }
  },

  addRanger: function (spawnObj, roomName, creepLevel, spawnName, creepsLevel) {
    var minLevel;
    for (index in spawnObj.memory.MIN_SPAWN_ENERGY) {
      if (spawnObj.memory.MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = index;
      }
    }
    if (!minLevel) {
      minLevel = creepsLevel;
    }
    if (spawnObj.memory.SPAWN_QUEUE.length < spawnObj.memory.SPAWN_QUEUE_MAX) {
      spawnObj.memory.SPAWN_QUEUE.push({ body: spawnObj.memory.RANGER_BODY[minLevel], memory: { role: spawnObj.memory.ROLES.ranger, target: roomName, owner: spawnName, goneRoom: null } });
      notifier.infoNotify(spawnObj, spawnName, "Add to queue a ranger. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
    }
  },

  addHealer: function (spawnObj, roomName, creepLevel, spawnName, creepsLevel) {
    var minLevel;
    for (index in spawnObj.memory.MIN_SPAWN_ENERGY) {
      if (spawnObj.memory.MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = index;
      }
    }
    if (!minLevel) {
      minLevel = creepsLevel;
    }
    if (spawnObj.memory.SPAWN_QUEUE.length < spawnObj.memory.SPAWN_QUEUE_MAX) {
      spawnObj.memory.SPAWN_QUEUE.push({ body: spawnObj.memory.HEALER_BODY[minLevel], memory: { role: spawnObj.memory.ROLES.healer, target: roomName, owner: spawnName, goneRoom: null } });
      notifier.infoNotify(spawnObj, spawnName, "Add to queue a healer. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
    }
  },

  addClaimer: function (spawnObj, roomName, creepLevel, spawnName, creepsLevel) {
    var minLevel;
    for (index in spawnObj.memory.MIN_SPAWN_ENERGY) {
      if (spawnObj.memory.MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = index;
      }
    }
    if (!minLevel) {
      minLevel = creepsLevel;
    }
    if (spawnObj.memory.SPAWN_QUEUE.length < spawnObj.memory.SPAWN_QUEUE_MAX && spawnObj.memory.CLAIMER_BODY[minLevel]) {
      spawnObj.memory.SPAWN_QUEUE.push({ body: spawnObj.memory.CLAIMER_BODY[minLevel], memory: { role: spawnObj.memory.ROLES.claimer, isTransfer: false, owner: spawnName, targetRoom: null, goneRoom: null } });
      notifier.infoNotify(spawnObj, spawnName, "Add to queue a claimer. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
    }
  },

  spawnQueqe: function (spawnObj, spawnRoom, creeps, state, roomName, creepLevel, spawnName) {
    var harvesters = _.filter(creeps, (creep) => creep.memory.role == spawnObj.memory.ROLES.harvester);
    if (!creeps.length || harvesters.length == 0 && spawnRoom.energyAvailable < spawnObj.memory.MIN_SPAWN_ENERGY[creepLevel]) {
      res = spawnObj.createCreep(spawnObj.memory.HARVESTER_BODY_ECO, "harvester-" + Game.time, { role: spawnObj.memory.ROLES.harvester, isTransfer: false, sourceId: null, owner: spawnName });
      if (_.isString(res)) {
        notifier.infoNotify(spawnObj, spawnName, "Creating a ECO harvester '" + res + "'");
      } else {
        notifier.wrongNotify(spawnName, "ECO harvester spawn error: " + res);
      }
      spawnObj.memory.SPAWN_QUEUE = [];
    } else {
      if (!spawnObj.spawning) {
        switch (state) {
          case spawnObj.memory.ROOM_STATES.STARTED:
          case spawnObj.memory.ROOM_STATES.EVOLUTION: {
            var creep;
            if (spawnRoom.controller.ticksToDowngrade < 2000) {
              creep = spawnObj.memory.SPAWN_QUEUE.splice(spawnObj.memory.SPAWN_QUEUE.findIndex(e => e.memory.role == spawnObj.memory.ROLES.upgrader), 1);
            } else {
              creep = spawnObj.memory.SPAWN_QUEUE.shift();
            }
            if (creep) {
              if (!this.setSpawning(spawnObj, creep)) {
                spawnObj.memory.SPAWN_QUEUE.unshift(creep);
              }
            }
            break;
          }
          case spawnObj.memory.ROOM_STATES.DEFEND: {
            var creep = spawnObj.memory.SPAWN_QUEUE.splice(spawnObj.memory.SPAWN_QUEUE.findIndex(e => e.memory.role == spawnObj.memory.ROLES.solder), 1);
            if (creep) {
              if (!this.setSpawning(spawnObj, creep)) {
                spawnObj.memory.SPAWN_QUEUE.unshift(creep);
              }
            }
          }
        }
      }
    }
    // spawnObj.memory['queue'] = spawnObj.memory.SPAWN_QUEUE;
  },

  setSpawning: function (spawnObj, creep) {
    var res;
    res = spawnObj.createCreep(creep.body, creep.memory.role + "-" + Game.time, creep.memory);
    if (res == ERR_NOT_ENOUGH_ENERGY) {
      return false;
    }
    if (_.isString(res)) {
      notifier.infoNotify(spawnObj, creep.memory.role, "Creating '" + res + "' was started. Queue: " + spawnObj.memory.SPAWN_QUEUE.length);
      return true;
    } else {
      notifier.wrongNotify(creep.memory.role, " spawn error: " + res);
      return false;
    }
  },
};