module.exports = {
  addHarvester: function(roomName, creepLevel, spawnName) {
    var minLevel = MIN_SPAWN_ENERGY.findIndex(val => val <= creepLevel);
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: HARVESTER_BODY[minLevel], memory: {role : ROLES.harvester, isTransfer : false, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a harvester. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addUpgrader: function(roomName, creepLevel, spawnName) {
    var minLevel = MIN_SPAWN_ENERGY.findIndex(val => val <= creepLevel);
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: CL_UPGRADER_BODY[minLevel], memory: {role : ROLES.upgrader, isTransfer : false, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a cl_upgrader. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addBuilder: function(roomName, creepLevel, spawnName) {
    var minLevel;
    for(index in MIN_SPAWN_ENERGY) {
      if(MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = MIN_SPAWN_ENERGY[index];
      }
    }
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: EX_BUILDER_BODY[minLevel], memory: {role : ROLES.builder, isTransfer : false, isBuilding : false, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a ex_builder. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addRepairer: function(roomName, creepLevel, spawnName) {
    var minLevel;
    for(index in MIN_SPAWN_ENERGY) {
      if(MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = MIN_SPAWN_ENERGY[index];
      }
    }
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: REPAIRER_BODY[minLevel], memory: {role : ROLES.repairer, isTransfer : false, isRepair : false, target: roomName, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a repairer. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addSolder: function(roomName, creepLevel, spawnName) {
    var minLevel;
    for(index in MIN_SPAWN_ENERGY) {
      if(MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = MIN_SPAWN_ENERGY[index];
      }
    }
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: SOLDER_BODY[minLevel], memory: {role : ROLES.solder, target: roomName, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a solder. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addRanger: function(roomName, creepLevel, spawnName) {
    var minLevel;
    for(index in MIN_SPAWN_ENERGY) {
      if(MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = MIN_SPAWN_ENERGY[index];
      }
    }
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: RANGER_BODY[creepLevel], memory: {role : ROLES.ranger, target: roomName, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a ranger. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addHealer: function(roomName, creepLevel, spawnName) {
    var minLevel;
    for(index in MIN_SPAWN_ENERGY) {
      if(MIN_SPAWN_ENERGY[index] <= creepLevel) {
        minLevel = MIN_SPAWN_ENERGY[index];
      }
    }
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: HEALER_BODY[lowCreepLevel], memory: {role : ROLES.healer, target: roomName, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a healer. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  spawnQueqe: function(spawnObj, spawnRoom, creeps, state, roomName, creepLevel, spawnName) {
    var harvesters = _.filter(creeps, (creep) => creep.memory.role == ROLES.harvester);
    if (!creeps.length || harvesters.length == 0 && spawnRoom.energyAvailable < MIN_SPAWN_ENERGY[creepLevel]) {
      res = spawnObj.createCreep(HARVESTER_BODY_ECO, null, {role : ROLES.harvester, isTransfer : false, sourceId : null, owner: spawnName });
      if(_.isString(res)) {
        notifier.infoNotify(spawnName, "Creating a ECO harvester '" + res + "'");
      } else {
        notifier.wrongNotify(spawnName, "ECO harvester spawn error: " + res);
      }
      SPAWN_QUEUE[roomName] = [];
    } else {
      if( !spawnObj.spawning ) {
        switch(state) {
          case ROOM_STATES.STARTED:
          case ROOM_STATES.EVOLUTION: {
            var creep;
            if(spawnRoom.controller.ticksToDowngrade < 2000) {
              creep = SPAWN_QUEUE[roomName].splice(SPAWN_QUEUE[roomName].findIndex(e => e.memory.role == ROLES.upgrader),1);
            } else {
              creep = SPAWN_QUEUE[roomName].shift();
            }
            if (creep) {
              if(!this.setSpawning(spawnObj, creep)) {
                SPAWN_QUEUE[roomName].unshift(creep);
              }
            }
            break;
          }
          case ROOM_STATES.DEFEND: {
            var creep = SPAWN_QUEUE[roomName].splice(SPAWN_QUEUE[roomName].findIndex(e => e.memory.role == ROLES.solder),1);
            if (creep) {
              if(!this.setSpawning(spawnObj, creep)) {
                SPAWN_QUEUE[roomName].unshift(creep);
              }
            }
          }
        }
      }
    }
    spawnObj.memory['queue'] = SPAWN_QUEUE[roomName];
  },

  setSpawning: function(spawnObj, creep) {
    var res;
    res = spawnObj.createCreep(creep.body, null, creep.memory);
    if(res == ERR_NOT_ENOUGH_ENERGY) {
      return false;
    }
    if(_.isString(res)) {
      notifier.infoNotify(creep.memory.role, "Creating '" + res + "' was started. Queue: "+SPAWN_QUEUE[spawnObj.room.name].length);
      return true;
    } else {
      notifier.wrongNotify(creep.memory.role, " spawn error: " + res);
      return false;
    }
  },
};