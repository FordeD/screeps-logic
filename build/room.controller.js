var   SPAWN_NAME      = "";
var   SPAWN_ROOM      = null;
var   SPAWN_OBJ       = null;
var   ROOM_STATE      = 0;
var   SOURCES         = null;
var   STORAGES        = null;
var   HARVEST_ROOMS   = null;
var   NEAR_ROOMS      = null;

var CREEP_LEVEL              = 0;
var CREEP_ENERGY_LEVEL       = 0;
var CONTROLLER_LEVEL         = 0;

var HARVESTER_COUNT          = 0;
var CL_UPGRADER_COUNT        = 0;
var EX_BUILDER_COUNT         = 0;
var SOLDER_COUNT             = 0;
var REPAIRER_COUNT           = 0;
var RANGER_COUNT             = 0;
var HEALER_COUNT             = 0;
var CLAIMER_COUNT            = 0;

var HARVESTER_QUEUE_COUNT    = 0;
var CL_UPGRADER_QUEUE_COUNT  = 0;
var EX_BUILDER_QUEUE_COUNT   = 0;
var SOLDER_QUEUE_COUNT       = 0;
var REPAIRER_QUEUE_COUNT     = 0;
var RANGER_QUEUE_COUNT       = 0;
var HEALER_QUEUE_COUNT       = 0;
var CLAIMER_QUEUE_COUNT       = 0;

var CREEPS                   = null;
var COMBAT_CREEPS            = null;   
var WORK_CREEPS              = null;
var CLAIMERS_CREEPS          = null;

module.exports = {
  harvester_doing: function(creep) {
    var total = _.sum(creep.carry);    

    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if(total < creep.carryCapacity && !creep.memory.isTransfer) {
      if (!creep.memory.sourceId) {
        let source = this.getFreeSource();
        if(source) {
          creep.memory.sourceId = source;
        } else {
          if(!creep.memory.goneRoom) {
            for(var index in NEAR_ROOMS) {
              var roomName = NEAR_ROOMS[index];
              var emptyRoom = _.filter(WORK_CREEPS, (creep) => creep.memory.goneRoom == roomName);
              if(emptyRoom.length < 4) {
                creep.memory.goneRoom = roomName;
                break;
              }
            }
          } else {
            if(creep.room.name == SPAWN_ROOM.name || creep.room.name != creep.memory.goneRoom) {
              var exitDirection =  Game.map.findExit(creep.room.name == SPAWN_ROOM.name ? SPAWN_ROOM : creep.room , creep.memory.goneRoom);
              var route = creep.pos.findClosestByRange(exitDirection);
              creep.moveTo(route);
            } else {
              let source = this.getFreeSource(creep,true);
              if(source) {
                creep.memory.sourceId = source;
              }
            }
          }
        }
      } else {
        var source = Game.getObjectById(creep.memory.sourceId);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, CREEP_MOVE_LINE);
        }
        return;
      }
    }
    
    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      creep.memory.sourceId = null;
      creep.memory.goneRoom = false;
    }

    var currTransfer = Game.getObjectById(creep.memory.isTransfer);
    if(creep.room.name != SPAWN_ROOM.name) {
      creep.memory.goneRoom = SPAWN_ROOM.name;
      if(creep.room.name == SPAWN_ROOM.name || creep.room.name != creep.memory.goneRoom) {
        var exitDirection =  Game.map.findExit(creep.room.name , SPAWN_ROOM.name);
        var route = creep.pos.findClosestByRange(exitDirection);
        creep.moveTo(route);
      } else {
        let source = this.getFreeSource(creep,true);
      }
    } else {
      if(creep.memory.isTransfer == true) {
        var store = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (obj) => { 
          return (obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE) && obj.store[RESOURCE_ENERGY] < obj.storeCapacity;
        }});

        var extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function(obj) { 
          return obj.structureType == STRUCTURE_EXTENSION && obj.energy < obj.energyCapacity
        }});

        var withoutEnergyStructures = [
          creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (obj) => { 
            if(obj.structureType == STRUCTURE_TOWER) {
              return obj.energy < 500;
            }
            return false;
          }}),
          SPAWN_OBJ.energy < SPAWN_OBJ.energyCapacity ? SPAWN_OBJ : false,
          CREEPS.length >= SPAWN_QUEUE_MAX-2 ? store : extension,
          CREEPS.length >= SPAWN_QUEUE_MAX-2 ? extension : store
        ];

        var goneTransfer = false;
        for( index in withoutEnergyStructures) {
          var obj = withoutEnergyStructures[index];
          if (obj) {
            goneTransfer = true;
            if(creep.transfer(obj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(obj, CREEP_MOVE_LINE);
              creep.memory.isTransfer = obj.id;
              creep.memory.goneRoom = false;
            }
            break;
          }
        }

        if(!goneTransfer) {
          this.cl_upgrader_doing(creep);
        }
      } else {
        switch(creep.transfer(currTransfer, RESOURCE_ENERGY)) {
          case ERR_NOT_IN_RANGE: {
            creep.moveTo(currTransfer, CREEP_MOVE_LINE);
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
    return;
  },

  cl_upgrader_doing: function(creep) {
    var total = _.sum(creep.carry);
    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if(total < creep.carryCapacity && !creep.memory.isTransfer) {
      if(!this.creepGetEnergy(creep)) {
        return;
      }
    }

    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      creep.memory.sourceId = null;
    }

    if(creep.memory.isTransfer) {
      if(SPAWN_ROOM.controller) {
        var res = creep.upgradeController(SPAWN_ROOM.controller);
        if(res == ERR_NOT_IN_RANGE) {
          creep.moveTo(SPAWN_ROOM.controller, CREEP_MOVE_LINE);
        }
      } 
      if(creep.carry.energy == 0 ) {
        creep.memory.isTransfer = false;
      }
    }    
  },

  ex_builder_doing: function(creep) {
    var total = _.sum(creep.carry);
    
    if(total == 0 ) {
      creep.memory.isTransfer = false;
      creep.memory.isBuilding = false;
    }

    if(total < creep.carryCapacity && !creep.memory.isTransfer && !creep.memory.isBuilding) {
      if(!this.creepGetEnergy(creep)) {
        return;
      }
    }

    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      creep.memory.sourceId = null;
    }

    var structures = [STRUCTURE_EXTENSION,STRUCTURE_TOWER,STRUCTURE_STORAGE,STRUCTURE_CONTAINER,STRUCTURE_WALL,STRUCTURE_RAMPART,STRUCTURE_ROAD];
    for(var index = 0; index < structures.length; index++) {
      var res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: { structureType: structures[index] } });
      if(res) {
        creep.memory.isBuilding = true;
        creep.memory.exTarget = res.id;
        break;
      }
    }

    if(creep.memory.exTarget) {
      var target = Game.getObjectById(creep.memory.exTarget);//Game.constructionSites[cr.memory.exTarget];
      if(target) {
        if(target.progress < target.progressTotal) {
          if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, CREEP_MOVE_LINE);
          }
        }
      } else {
        creep.memory.exTarget = null;
      }
    } else {
      creep.memory.isBuilding = false;
      creep.memory.isTransfer = true;
      this.repairer_doing(creep);
    }    
  },

  setBuilderTarger: function(creep) {
    var structures = [STRUCTURE_EXTENSION,STRUCTURE_TOWER,STRUCTURE_WALL,STRUCTURE_RAMPART];
    for(var index = 0; index < structures.length; index++) {
      var res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: { structureType: structures[index] } });
      if(res) {
        creep.memory.isBuilding = true;
        creep.memory.exTarget = res.id;
        break;
      }
    }

    if(!creep.memory.exTarget) {
      let repairStructure = [];
      let state = this.getState();
      repairStructure = creep.room.find(FIND_STRUCTURES, { 
        filter: (structure) => { 
          return (structure.hits < state == ROOM_STATES.DEFEND ? 650 : structure.hitsMax && structure.hits > 0);
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

  creepGetEnergy: function(creep) {
    var store = SPAWN_ROOM.find(FIND_STRUCTURES, { filter: (obj) => { 
      if(obj.structureType == STRUCTURE_STORAGE) {
        return obj.store[RESOURCE_ENERGY] >= creep.carryCapacity;
      }
      return false;
    }});
    if(store[0].id) {
      if(creep.withdraw(store, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(store);
      }
      return;
    } else {
      if (!creep.memory.sourceId) {
        creep.memory.sourceId = this.getFreeSource();
      } else {
        var source = _.filter(SOURCES, (source) => source.id == creep.memory.sourceId);
        if(creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source[0], CREEP_MOVE_LINE);
        }
        return false;
      }
    }
    return true;
  },

  solder_doing: function(creep) {
    if(creep.room.name == creep.memory.target) {
      if(creep.pos.x > 45 || creep.pos.Y > 45 || creep.pos.x < 5 || creep.pos.y < 5) {
        creep.moveTo(SPAWN_OBJ, CREEP_MOVE_LINE);
      } else {
        creep.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]));
      }
    } else {
        var route = Game.map.findRoute(creep.room, creep.memory.target);
        if(route.length > 0) {
          creep.moveTo(creep.pos.findClosestByRange(route[0].exit), CREEP_MOVE_LINE);
        }
    }
  },

  healer_doing: function(creep) {
    if(creep.room.name == creep.memory.target) {
      var hittedCreep = creep.pos.findClosestByRange(FIND_CREEPS, { filter: function(creep) { 
          return creep.hits < creep.hitsMax;
        }
      });
      if(hittedCreep) {
        creep.heal(hittedCreep);
      } else {
        if(creep.pos.x > 45 || creep.pos.Y > 45 || creep.pos.x < 5 || creep.pos.y < 5) {
          creep.moveTo(SPAWN_OBJ, CREEP_MOVE_LINE);
        } else {
          creep.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]));
        }
      }
  } else {
      var route = Game.map.findRoute(creep.room, creep.memory.target);
      if(route.length > 0) {
        creep.moveTo(creep.pos.findClosestByRange(route[0].exit), CREEP_MOVE_LINE);
      }
  }
  },

  repairer_doing: function(creep) {
    var total = _.sum(creep.carry);
    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if(total < creep.carryCapacity && !creep.memory.isTransfer) {
      if(!this.creepGetEnergy(creep)) {
        return;
      }
    }

    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      creep.memory.sourceId = null;
    }

    if(creep.memory.isTransfer) {
      if (creep.memory.exTarget) {
        var target = Game.getObjectById(creep.memory.exTarget);//Game.constructionSites[cr.memory.exTarget];
        if(this.checkRepairedStructure(target)) {
          if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, CREEP_MOVE_LINE);
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
              return structure.hits < WALL_HITS_MAX[CONTROLLER_LEVEL] && structure.hits > 0 && structure.structureType == STRUCTURE_WALL;
            }
          })
        ];
  
        var goneRepair = false;
        for( index in repairStructure) {
          var obj = repairStructure[index];
          if (obj) {
            creep.memory.exTarget = obj.id;
            goneRepair = true;
            break;
          }
        }
  
        if(!goneRepair) {
          res = SPAWN_ROOM.find(FIND_STRUCTURES, { filter: (obj) => { 
            if(obj.structureType == STRUCTURE_TOWER) {
              return obj.energy < obj.storeCapacity;
            }
            return false;
          }});
          if(res.id) {
            if(creep.transfer(res, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(res, CREEP_MOVE_LINE);
            }
            return;
          } else {
            creep.memory.isRepair = false;
            creep.memory.isTransfer = true;
            this.harvester_doing(creep);
          }
        }
      }
    }  
  },

  checkRepairedStructure: function(target) {
    if(target) {
      if(((target.structureType == STRUCTURE_WALL) || (target.structureType == STRUCTURE_RAMPART)) && target.hits < WALL_HITS_MAX[CONTROLLER_LEVEL]) {
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
  },

  claimer_doing: function(creep) {
    if(!creep.memory.targetRoom) {
      var claimers = _.filter(CREEPS, (creep) => creep.memory.role == ROLES.claimer);
      
      for(var index in NEAR_ROOMS) {
        var roomName = NEAR_ROOMS[index];
        var emptyRoom = _.filter(claimers, (creep) => creep.memory.targetRoom == roomName);
        if(emptyRoom.length <= 1) {
          creep.memory.targetRoom = roomName;
          break;
        }
      }
    } else {
      if(creep.room == SPAWN_ROOM) {
        var exitDirection =  Game.map.findExit(SPAWN_ROOM, creep.memory.targetRoom);
        var route = creep.pos.findClosestByRange(exitDirection);
        creep.moveTo(route);
      } else {
        if(creep.room.controller && !creep.room.controller.my) {
          if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
              creep.moveTo(creep.room.controller);
          }
        }
      }
    }
    return;
  },

  checkCreeps: function() {
    HARVESTER_COUNT    = 0;
    CL_UPGRADER_COUNT  = 0;
    EX_BUILDER_COUNT   = 0;
    REPAIRER_COUNT     = 0;
    RANGER_COUNT       = 0;
    HEALER_COUNT       = 0;
    CLAIMER_COUNT      = 0;

    for(var name in CREEPS) {
      var creep = CREEPS[name];
      if (creep) {
        var role = creep.memory.role;
        switch(role) {
          case ROLES.harvester: {
            ++HARVESTER_COUNT;
            break;
          }
          case ROLES.upgrader: {
            ++CL_UPGRADER_COUNT;
            break;
          }
          case ROLES.builder: {
            ++EX_BUILDER_COUNT;
            break;
          }
          case ROLES.solder: {
            ++SOLDER_COUNT;
            break;
          }
          case ROLES.repairer: {
            ++REPAIRER_COUNT;
            break;
          }
          case ROLES.ranger: {
            ++RANGER_COUNT;
            break;
          }
          case ROLES.healer: {
            ++HEALER_COUNT;
            break;
          }
          case ROLES.claimer: {
            ++CLAIMER_COUNT;
            break;
          }
        } 
      }
    }

    for(var i in SPAWN_QUEUE[SPAWN_ROOM.name]) {
      var role = SPAWN_QUEUE[SPAWN_ROOM.name][i].memory.role;
      switch(role) {
        case ROLES.harvester: {
          ++HARVESTER_QUEUE_COUNT;
          break;
        }
        case ROLES.upgrader: {
          ++CL_UPGRADER_QUEUE_COUNT;
          break;
        }
        case ROLES.builder: {
          ++EX_BUILDER_QUEUE_COUNT;
          break;
        }
        case ROLES.solder: {
          ++SOLDER_QUEUE_COUNT;
          break;
        }
        case ROLES.repairer: {
          ++REPAIRER_QUEUE_COUNT;
          break;
        }
        case ROLES.ranger: {
          ++RANGER_QUEUE_COUNT;
          break;
        }
        case ROLES.healer: {
          ++HEALER_QUEUE_COUNT;
          break;
        }
        case ROLES.claimer: {
          ++CLAIMER_QUEUE_COUNT;
          break;
        }
      }
    }  
  },

  killFiewLiveCreeps: function() {
    let spName = SPAWN_NAME ? SPAWN_NAME : SPAWN_OBJ.name;
    creeps = _.filter(Game.creeps, (creep) => creep.memory.owner == spName && (creep.memory.role != ROLES.solder || creep.memory.role != ROLES.ranger || creep.memory.role != ROLES.healer));
    for(name in creeps) {
      let creep = creeps[name];
      var total = _.sum(creep.carry);
      if(creep.ticksToLive < 50 && total == 0) {
        creep.suicide();
      }
    }
  },

  checkSpawnCreeps: function() {
    if( SPAWN_QUEUE[SPAWN_ROOM.name].length < SPAWN_QUEUE_MAX ) {
      let state = this.getState();
      if((HARVESTER_COUNT+HARVESTER_QUEUE_COUNT) < HARVESTER_MAX_COUNT[state]) {
        console.log("h:" + HARVESTER_COUNT + ":"+HARVESTER_MAX_COUNT[state]+" queue:"+HARVESTER_QUEUE_COUNT);
        queueController.addHarvester(SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if((CL_UPGRADER_COUNT+CL_UPGRADER_QUEUE_COUNT) < CL_UPGRADER_MAX_COUNT[state]) {
        console.log("cl:" + CL_UPGRADER_COUNT + ":"+CL_UPGRADER_MAX_COUNT[state]+" queue:"+CL_UPGRADER_QUEUE_COUNT);
        queueController.addUpgrader(SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if((EX_BUILDER_COUNT+EX_BUILDER_QUEUE_COUNT) < EX_BUILDER_MAX_COUNT[state]) {
        console.log("b:" + EX_BUILDER_COUNT + ":"+EX_BUILDER_MAX_COUNT[state]+" queue:"+EX_BUILDER_QUEUE_COUNT);
        queueController.addBuilder(SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if((REPAIRER_COUNT+REPAIRER_QUEUE_COUNT) < REPAIRER_MAX_COUNT[state]) {
        console.log("r:" + REPAIRER_COUNT + ":"+REPAIRER_MAX_COUNT[state]+" queue:"+REPAIRER_QUEUE_COUNT);
        queueController.addRepairer(SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if((SOLDER_COUNT+SOLDER_QUEUE_COUNT) < SOLDER_MAX_COUNT[state]) {
        queueController.addSolder(SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if((RANGER_COUNT+RANGER_QUEUE_COUNT) < RANGER_MAX_COUNT[state]) {
        queueController.addRanger(SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if((HEALER_COUNT+HEALER_QUEUE_COUNT) < HEALER_MAX_COUNT[state]) {
        queueController.addHealer(SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if((CLAIMER_COUNT+CLAIMER_QUEUE_COUNT) < CLAIMER_MAX_COUNT[state] && GCL > 1) {
        console.log("c:" + CLAIMER_COUNT + ":"+CLAIMER_MAX_COUNT[state]+" queue:"+CLAIMER_QUEUE_COUNT);
        queueController.addClaimer(SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      }
    }
    return false;
  },

  creepsActions: function() {
    let state = this.getState();
    for(var name in CREEPS) {
      var creep = CREEPS[name];
      if (creep) {
        var role = creep.memory.role;
        switch(role) {
          case ROLES.harvester: {
            this.harvester_doing(creep);
            break;
          }
          case ROLES.upgrader: {
            this.cl_upgrader_doing(creep);
            break;
          }
          case ROLES.builder: {
            this.ex_builder_doing(creep);
            break;
          }
          case ROLES.repairer: {
            if (state != ROOM_STATES.DEFEND) {
              this.repairer_doing(creep);
            }
            break;
          }
          case ROLES.solder: {
            if (state != ROOM_STATES.DEFEND && state != ROOM_STATES.ATACK ) {
              this.solder_doing(creep);
            }
            break;
          }
          case ROLES.ranger: {
            if (state != ROOM_STATES.DEFEND && state != ROOM_STATES.ATACK ) {
              this.solder_doing(creep);
            }
            break;
          }
          case ROLES.healer: {
            if (state != ROOM_STATES.DEFEND && state != ROOM_STATES.ATACK ) {
              this.healer_doing(creep);
            }
            break;
          }
          case ROLES.claimer: {
            this.claimer_doing(creep);
            break;
          }
        }
      }
    }      
  },

  getLevel: function() {
    max = SPAWN_ROOM.energyCapacityAvailable;
    CREEP_ENERGY_LEVEL = SPAWN_ROOM.energyAvailable;
    if (max < (300 + 5 * 50)) {
        CREEP_LEVEL = 0;
    } else if (max < (300 + 10*50)) {
        CREEP_LEVEL = 1;
    } else if (max < (300 + 20*50)) {
        CREEP_LEVEL = 2;
    } else {
      let currTime = Game.time;
      if(!SPAWN_OBJ.memory['notifyTimer'] || currTime - SPAWN_OBJ.memory['notifyTimer'] > NOTIFY_TIMER_COUNT.LEVEL ) {
        notifier.infoNotify('Creep level', 'just maximum, need upgrade logic');
        SPAWN_OBJ.memory['notifyTimer'] = currTime;
      }
      CREEP_LEVEL = 2;
    }
  },

  getFreeSource: function(creep, isOtherRoom) {
    if(!isOtherRoom) {
      for(var index in SOURCES) {
        var sourceID = SOURCES[index].id;
        var harvesters = _.filter(CREEPS, (creep) => creep.memory.sourceId == sourceID);
        if(harvesters.length < 3 ) {
          return sourceID;
        }
      }
    } else {
      if(!SPAWN_OBJ.memory.sources) {
        SPAWN_OBJ.memory.sources = [];
      }
      if(!SPAWN_OBJ.memory.sources[creep.memory.goneRoom]) {
        this.setSourcesFromOtherRoom(creep);
      } 
      var thisRoomSources = SPAWN_OBJ.memory.sources[creep.room.name];
      for (index in thisRoomSources) {
        var harvesters = _.filter(CREEPS, (creep) => creep.memory.sourceId == thisRoomSources[index]);
        if(harvesters.length < 2 ) {
          return thisRoomSources[index];
        }
      }
    }
  },

  setSourcesFromOtherRoom: function(creep) {
    let thisRoomSources = creep.room.find(FIND_SOURCES_ACTIVE);
    SPAWN_OBJ.memory.sources[creep.room.name] = [];
    for(index in thisRoomSources) {
      source = thisRoomSources[index].id;
      SPAWN_OBJ.memory.sources[creep.room.name].push(source);
    }
    notifier.infoNotify('SEARCH ROOM', 'Sources:'+SPAWN_OBJ.memory.sources[creep.room.name].length);
    return true;
  },

  checkDangerInRoom: function() {
    if(HOSTILES[SPAWN_ROOM.name].length > 0) {
      ROOM_STATE = ROOM_STATES.DEFEND;
      return true;
    }
    return false;
  },

  // GETTERS
  getSpawn: function() {
    if(SPAWN_OBJ) {
      return SPAWN_OBJ;
    } else {
      return false;
    }
  },

  getState: function() {
    return ROOM_STATE;
  },

  getSolders: function() {
    if(COMBAT_CREEPS && COMBAT_CREEPS > 0) {
      return COMBAT_CREEPS;
    }
    return false;
  },

  // SETTERS

  // METHODS
  updateState: function() {
    if (CREEP_LEVEL < 2 && SPAWN_ROOM.controller.level < 2 && CREEPS.length <= 10) {
      ROOM_STATE = ROOM_STATES.BUILDING;
    } else if (CREEP_LEVEL >= 2 && SPAWN_ROOM.controller.level >= 3 && CREEPS.length > 10) {
      ROOM_STATE = ROOM_STATES.EVOLUTION;
    } else if (HOSTILES[SPAWN_ROOM] && HOSTILES[SPAWN_ROOM].length > 0 ) {
      ROOM_STATE = ROOM_STATES.DEFEND;
    } else if (COMBAT_CREEPS && COMBAT_CREEPS.length >= 6) {
      ROOM_STATE = ROOM_STATES.ATACK;
    }
  },

  updateDynamicVariables: function() {
    CONTROLLER_LEVEL = CONTROLLER_LEVEL ? CONTROLLER_LEVEL : SPAWN_ROOM.controller.level;

    if (!SPAWN_QUEUE) {
      SPAWN_QUEUE = [];
    }
    if (!SPAWN_QUEUE[SPAWN_ROOM.name]) {
      SPAWN_QUEUE[SPAWN_ROOM.name] = [];
    }
    SPAWN_QUEUE[SPAWN_ROOM.name] = SPAWN_OBJ.memory['queue'] ? SPAWN_OBJ.memory['queue'] : false;


    STORAGES = SPAWN_ROOM.find(FIND_STRUCTURES, { 
      filter: (obj) => { obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE }
    });

    CREEPS = _.filter(Game.creeps, (creep) => creep.memory.owner == SPAWN_NAME);
    COMBAT_CREEPS = _.filter(CREEPS, (creep) => creep.memory.role == ROLES.solder || creep.memory.role == ROLES.ranger || creep.memory.role == ROLES.healer);
    WORK_CREEPS = _.filter(CREEPS, (creep) => creep.memory.role != ROLES.solder && creep.memory.role != ROLES.ranger && creep.memory.role != ROLES.healer && creep.memory.role != ROLES.claimer);


    let hostiles = SPAWN_ROOM.find(FIND_HOSTILE_CREEPS);
    if (!HOSTILES) {
      HOSTILES = [];
    }
    if (!HOSTILES[SPAWN_ROOM.name]) {
      HOSTILES[SPAWN_ROOM.name] = [];
    }
    HOSTILES[SPAWN_ROOM.name] = hostiles.length > 0 ? hostiles : false;

    // SOURCES = SOURCES ? SOURCES : SPAWN_ROOM.find(FIND_SOURCES_ACTIVE);

    if(!SPAWN_OBJ.memory['NearRooms']) {
      SPAWN_OBJ.memory['NearRooms'] = Game.map.describeExits(SPAWN_ROOM.name);
    }

    NEAR_ROOMS = SPAWN_OBJ.memory['NearRooms'];

    for(index in NEAR_ROOMS) {
      var roomName = NEAR_ROOMS[index];
      for(name in Game.flags) {
        let flag = Game.flags[name];
        let fromName = flag.name.split("-")
        if( ( flag.room == roomName || fromName[0] == SPAWN_NAME ) && !flag.memory['owner']) {
          flag.memory['owner'] = SPAWN_NAME;
        }
      }
    }

    HARVEST_ROOMS = [];
    for(name in Game.flags) {
      var flag = Game.flags[name];
      if(flag.memory['owner'] == SPAWN_NAME) {
        HARVEST_ROOMS.push(flag.room);
        break;
      }
    }

    SOURCES = SOURCES ? SOURCES : SPAWN_ROOM.find(FIND_SOURCES_ACTIVE);
  },

  processing : function(spawn_obj, spawnName) {
    if(spawn_obj) {
      SPAWN_NAME = spawn_obj.name;
      SPAWN_OBJ = spawn_obj;
      SPAWN_ROOM = spawn_obj.room;
    } else {
      SPAWN_OBJ = Game.spawns[spawnName];
    }
    this.killFiewLiveCreeps();
    this.updateDynamicVariables();
    this.getLevel();
    this.updateState();

    if (this.checkDangerInRoom()) {
      if(HOSTILES[SPAWN_ROOM.name].length >= 2) {
        var rangers = _.filter(CREEPS, (creep) => creep.memory.role == ROLES.repairer);
        COMBAT_CREEPS.concat(rangers);
      }
      defendController.processing(SPAWN_ROOM, HOSTILES[SPAWN_ROOM.name], COMBAT_CREEPS);
      towerController.processing(this.getState(), SPAWN_ROOM, HOSTILES[SPAWN_ROOM.name]);
      defendController.saveWorkCreeps(SPAWN_OBJ, WORK_CREEPS);
    } else {
      towerController.processing(this.getState(), SPAWN_ROOM, HOSTILES[SPAWN_ROOM.name]);
      this.creepsActions();
    }

    queueController.spawnQueqe(SPAWN_OBJ, SPAWN_ROOM, CREEPS, this.getState(), SPAWN_ROOM.name, CREEP_LEVEL, SPAWN_NAME);

    this.checkCreeps();
    if(CREEPS.length < CREEPS_MAX_COUNT) {
      this.checkSpawnCreeps();
    }

    buildController.processing(SPAWN_OBJ);
  }
};
