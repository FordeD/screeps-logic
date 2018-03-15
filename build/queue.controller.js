module.exports = {
  addHarvester: function(roomName, creepLevel, spawnName) {
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: HARVESTER_BODY[creepLevel], memory: {role : ROLES.harvester, isTransfer : false, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a harvester. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addUpgrader: function(roomName, creepLevel, spawnName) {
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: CL_UPGRADER_BODY[creepLevel], memory: {role : ROLES.upgrader, isTransfer : false, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a cl_upgrader. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addBuilder: function(roomName, creepLevel, spawnName) {
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: EX_BUILDER_BODY[creepLevel], memory: {role : ROLES.builder, isTransfer : false, isBuilding : false, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a ex_builder. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addRepairer: function(roomName, creepLevel, spawnName) {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: REPAIRER_BODY[creepLevel], memory: {role : ROLES.repairer, isTransfer : false, isRepair : false, target: roomName, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a repairer. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addSolder: function(roomName, creepLevel, spawnName) {
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: SOLDER_BODY[creepLevel], memory: {role : ROLES.solder, target: roomName, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a solder. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addRanger: function(roomName, creepLevel, spawnName) {
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: RANGER_BODY[creepLevel], memory: {role : ROLES.ranger, target: roomName, owner: spawnName }});
      notifier.infoNotify(spawnName, "Add to queue a ranger. Queue: "+SPAWN_QUEUE[roomName].length);
    }
  },

  addHealer: function(roomName, creepLevel, spawnName) {
    if(SPAWN_QUEUE[roomName].length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE[roomName].push({body: HEALER_BODY[creepLevel], memory: {role : ROLES.healer, target: roomName, owner: spawnName }});
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
        console.log('i will create creep');
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
              this.setSpawning(spawnObj, creep);
            }
            break;
          }
          case ROOM_STATES.DEFEND: {
            var creep = SPAWN_QUEUE[roomName].splice(SPAWN_QUEUE[roomName].findIndex(e => e.memory.role == ROLES.solder),1);
            if (creep) {
              this.setSpawning(spawnObj, creep);
            }
          }
        }
        console.log('i created creep');
      }
    }
    spawnObj.memory['queue'] = SPAWN_QUEUE[roomName];
  },

  setSpawning: function(spawnObj, creep) {
    var res;
    res = spawnObj.createCreep(creep.body, null, creep.memory);
    if(_.isString(res)) {
      notifier.infoNotify(creep.memory.role, "Creating '" + res + "' was started. Queue: "+SPAWN_QUEUE[spawnObj.room.name].length);
    } else {
      notifier.wrongNotify(creep.memory.role, " spawn error: " + res);
    }
  },
};