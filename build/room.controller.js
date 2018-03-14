/*          CREEP BODY
MOVE            50
WORK            100
CARRY           50
ATTACK          80
RANGED_ATTACK   150
HEAL            250
CLAIM           600
TOUGH           10
*/

/*
Controller level    - 1
    spawn energy        - 300
        
        HARVESTER_BODY      = [MOVE, WORK, WORK,  CARRY]
        CL_UPGRADER_BODY    = [MOVE, WORK, CARRY, CARRY, CARRY]
        EX_BUILDER_BODY     = [MOVE, WORK, CARRY, CARRY, CARRY]
*/


var DEFEND_CONTROLLER = null;
var ATACK_CONTROLLER  = null;
var TOWER_CONTROLLER  = null;

var   SPAWN_NAME      = "";
var   SPAWN_ROOM      = null;
var   SPAWN_OBJ       = null;
var   SPAWN_QUEUE     = null;
var   ROOM_STATE      = 0;
var   HOSTILES        = null;
var   SOURCES         = null;
var   STORAGES        = null;

var CREEP_LEVEL              = 0;
var CONTROLLER_LEVEL         = 0;

var HARVESTER_COUNT          = 0;
var CL_UPGRADER_COUNT        = 0;
var EX_BUILDER_COUNT         = 0;
var SOLDER_COUNT             = 0;
var REPAIRER_COUNT           = 0;
var RANGER_COUNT             = 0;
var HEALER_COUNT             = 0;

var HARVESTER_QUEUE_COUNT    = 0;
var CL_UPGRADER_QUEUE_COUNT  = 0;
var EX_BUILDER_QUEUE_COUNT   = 0;
var SOLDER_QUEUE_COUNT       = 0;
var REPAIRER_QUEUE_COUNT     = 0;
var RANGER_QUEUE_COUNT       = 0;
var HEALER_QUEUE_COUNT       = 0;

var CREEPS                   = null;
var COMBAT_CREEPS            = null;   

module.exports = {
  create_harvester: function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: HARVESTER_BODY[CREEP_LEVEL], memory: {role : ROLES.harvester, isTransfer : false, owner: SPAWN_NAME }});
      console.log("Add to queue a harvester. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_controller_upgrader: function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: CL_UPGRADER_BODY[CREEP_LEVEL], memory: {role : ROLES.upgrader, isTransfer : false, owner: SPAWN_NAME }});
      console.log("Add to queue a cl_upgrader. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_builder_extension: function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: EX_BUILDER_BODY[CREEP_LEVEL], memory: {role : ROLES.builder, isTransfer : false, isBuilding : false, owner: SPAWN_NAME }});
      console.log("Add to queue a ex_builder. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_repairer: function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: REPAIRER_BODY[CREEP_LEVEL], memory: {role : ROLES.repairer, isTransfer : false, isRepair : false, target: SPAWN_ROOM.name, owner: SPAWN_NAME }});
      console.log("Add to queue a repairer. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_solder: function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: SOLDER_BODY[CREEP_LEVEL], memory: {role : ROLES.solder, target: SPAWN_ROOM.name, owner: SPAWN_NAME }});
      console.log("Add to queue a solder. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_ranger: function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: RANGER_BODY[CREEP_LEVEL], memory: {role : ROLES.ranger, target: SPAWN_ROOM.name, owner: SPAWN_NAME }});
      console.log("Add to queue a ranger. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_healer: function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: HEALER_BODY[CREEP_LEVEL], memory: {role : ROLES.healer, target: SPAWN_ROOM.name, owner: SPAWN_NAME }});
      console.log("Add to queue a healer. Queue: "+SPAWN_QUEUE.length);
    }
  },

  spawnQueqe: function() {
    if (!CREEPS.length && SPAWN_ROOM.energyAvailable < MIN_SPAWN_ENERGY[CREEP_LEVEL]) {
      res = SPAWN_OBJ.createCreep(HARVESTER_BODY_ECO, null, {role : ROLES.harvester, isTransfer : false, sourceId : null, owner: SPAWN_NAME });
      if(_.isString(res)) {
        console.log("Creating a ECO harvester '" + res + "' was started");
      } else {
        console.log("ECO harvester spawn error: " + res);
      }
      SPAWN_QUEUE = [];
    } else if( !SPAWN_OBJ.spawning && SPAWN_ROOM.energyAvailable >= MIN_SPAWN_ENERGY[CREEP_LEVEL] && SPAWN_QUEUE.length > 0) {
      switch(this.getState()) {
        case ROOM_STANDART:
        case ROOM_EVOLUTION: {
          var creep;
          if(SPAWN_ROOM.controller.ticksToDowngrade < 2000) {
            creep = SPAWN_QUEUE.splice(SPAWN_QUEUE.findIndex(e => e.memory.role == ROLES.upgrader),1);
          } else {
            creep = SPAWN_QUEUE.shift();
          }
          if (creep) {
            this.setSpawning(creep);
          }
          break;
        }
        case ROOM_DEFEND:
        case ROOM_ATACK: {
          var creep = SPAWN_QUEUE.splice(SPAWN_QUEUE.findIndex(e => e.memory.role == ROLES.solder),1);
          if (creep) {
            this.setSpawning(creep);
          }
        }
      }
    }

    SPAWN_OBJ.memory['queue'] = SPAWN_QUEUE;
  },

  setSpawning: function(creep) {
    var res;
    res = SPAWN_OBJ.createCreep(creep.body, null, creep.memory);
    if(_.isString(res)) {
      console.log("Creating a " + creep.memory.role + " '" + res + "' was started. Queue: "+SPAWN_QUEUE.length);
    } else {
      console.log(creep.memory.role + " spawn error: " + res);
    }
  },

  harvester_doing: function(creep) {
    var total = _.sum(creep.carry);    

    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if(total < creep.carryCapacity && !creep.memory.isTransfer) {
      if (!creep.memory.sourceId) {
        creep.memory.sourceId = this.getFreeSource();
      } else {
        var source = _.filter(SOURCES, (source) => source.id == creep.memory.sourceId);
        if(creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source[0], CREEP_MOVE_LINE);
        }
        return;
      }
    }

    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
      creep.memory.sourceId = null;
    }
    if(creep.memory.isTransfer) {
      var withoutEnergyStructures = [
        SPAWN_OBJ.energy < SPAWN_OBJ.energyCapacity ? SPAWN_OBJ : false,
        creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function(obj) { 
            if(obj.structureType == STRUCTURE_EXTENSION ) {
              return obj.energy < obj.energyCapacity;
            }
            return false;
          }
        }),
        creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (obj) => { 
          if(obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE) {
            return obj.store[RESOURCE_ENERGY] < obj.storeCapacity;
          }
          return false;
        }}),
        creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (obj) => { 
          if(obj.structureType == STRUCTURE_TOWER) {
            return obj.energy < obj.energyCapacity;
          }
          return false;
        }}),
      ];

      var goneTransfer = false;
      for( index in withoutEnergyStructures) {
        var obj = withoutEnergyStructures[index];
        if (obj) {
          if(creep.transfer(obj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(obj, CREEP_MOVE_LINE);
          }
          goneTransfer = true;
          break;
        }
      }

      if(!goneTransfer) {
        this.cl_upgrader_doing(creep);
      }
    }    
  },

  cl_upgrader_doing: function(creep) {
    var total = _.sum(creep.carry);
    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if(total < creep.carryCapacity && !creep.memory.isTransfer) {
      if(!this.creep_get_energy(creep)) {
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
      if(!this.creep_get_energy(creep)) {
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
      this.harvester_doing(creep);
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

      repairStructure = creep.room.find(FIND_STRUCTURES, { 
        filter: (structure) => { 
          return (structure.hits < this.getState() == ROOM_STATES.DEFEND ? 650 : structure.hitsMax && structure.hits > 0);
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

  creep_get_energy: function(creep) {
    var store = SPAWN_ROOM.find(FIND_STRUCTURES, { filter: (obj) => { 
      if(obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE) {
        return obj.store[RESOURCE_ENERGY] >= creep.carryCapacity;
      }
      return false;
    }});
    if(store.id) {
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
        creep.move(_.sample([TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]));
    } else {
        var route = Game.map.findRoute(creep.room, creep.memory.target);
        if(route.length > 0) {
          creep.moveTo(creep.pos.findClosestByRange(route[0].exit), CREEP_MOVE_LINE);
        }
    }
  },

  healer_doing: function(creep) {
    if(creep.room.name == creep.memory.target) {
      var hittedCreep = tower.pos.findClosestByRange(FIND_CREEPS, { filter: function(creep) { 
          return creep.hits < creep.hitsMax;
        }
      });
      if(hittedCreep) {
        creep.heal(hittedCreep);
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

  repairer_doing: function(creep) {
    var total = _.sum(creep.carry);
    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if(total < creep.carryCapacity && !creep.memory.isTransfer) {
      if(!this.creep_get_energy(creep)) {
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
      if(target.structureType == STRUCTURE_WALL && target.hits < WALL_HITS_MAX[CONTROLLER_LEVEL]) {
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

  check_and_spawnd_creep: function() {
    if( SPAWN_QUEUE.length < SPAWN_QUEUE_MAX ) {
      HARVESTER_COUNT    = 0;
      CL_UPGRADER_COUNT  = 0;
      EX_BUILDER_COUNT   = 0;
      REPAIRER_COUNT     = 0;
      RANGER_COUNT       = 0;
      HEALER_COUNT       = 0;

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
          } 
        }
      }

      for(var i in SPAWN_QUEUE) {
        var role = SPAWN_QUEUE[i].memory.role;
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
        }
      }
      
      if((HARVESTER_COUNT+HARVESTER_QUEUE_COUNT) < HARVESTER_MAX_COUNT[this.getState()]) {
        console.log("h:" + HARVESTER_COUNT + ":"+HARVESTER_MAX_COUNT[this.getState()]+" queue:"+HARVESTER_QUEUE_COUNT);
        this.create_harvester();
      } else if((CL_UPGRADER_COUNT+CL_UPGRADER_QUEUE_COUNT) < CL_UPGRADER_MAX_COUNT[this.getState()]) {
        console.log("c:" + CL_UPGRADER_COUNT + ":"+CL_UPGRADER_MAX_COUNT[this.getState()]+" queue:"+CL_UPGRADER_QUEUE_COUNT);
        this.create_controller_upgrader();
      } else if((EX_BUILDER_COUNT+EX_BUILDER_QUEUE_COUNT) < EX_BUILDER_MAX_COUNT[this.getState()]) {
        console.log("b:" + EX_BUILDER_COUNT + ":"+EX_BUILDER_MAX_COUNT[this.getState()]+" queue:"+EX_BUILDER_QUEUE_COUNT);
        this.create_builder_extension();
      } else if((REPAIRER_COUNT+REPAIRER_QUEUE_COUNT) < REPAIRER_MAX_COUNT[this.getState()]) {
        console.log("r:" + REPAIRER_COUNT + ":"+REPAIRER_MAX_COUNT[this.getState()]+" queue:"+REPAIRER_QUEUE_COUNT);
        this.create_repairer();
      } else if((SOLDER_COUNT+SOLDER_QUEUE_COUNT) < SOLDER_MAX_COUNT[this.getState()]) {
        this.create_solder();
      } else if((RANGER_COUNT+RANGER_QUEUE_COUNT) < RANGER_MAX_COUNT[this.getState()]) {
        this.create_ranger();
      } else if((HEALER_COUNT+HEALER_QUEUE_COUNT) < HEALER_MAX_COUNT[this.getState()]) {
        this.create_healer();
      }
    }     
  },

  creep_doing: function() {
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
            if (this.getState() != ROOM_STATES.DEFEND) {
              this.repairer_doing(creep);
            }
            break;
          }
          case ROLES.solder: {
            let state = this.getState();
            if (state != ROOM_STATES.DEFEND || state != ROOM_STATES.ATACK ) {
              this.solder_doing(creep);
            }
            break;
          }
          case ROLES.solder: {
            let state = this.getState();
            if (state != ROOM_STATES.DEFEND || state != ROOM_STATES.ATACK ) {
              this.solder_doing(creep);
            }
            break;
          }
          case ROLES.solder: {
            let state = this.getState();
            if (state != ROOM_STATES.DEFEND || state != ROOM_STATES.ATACK ) {
              this.healer_doing(creep);
            }
            break;
          }
        }
      }
    }      
  },

  getLevel: function() {
    max = SPAWN_ROOM.energyCapacityAvailable;
    if (max < (300 + 5 * 50)) {
        CREEP_LEVEL = 0;
    } else if (max < (300 + 10*50)) {
        CREEP_LEVEL = 1;
    } else if (max < (300 + 20*50)) {
        CREEP_LEVEL = 2;
    } else {
        notifier.infoNotify('Creep level', 'just maximum, need upgrade logic');
        CREEP_LEVEL = 2;
    }
  },

  getFreeSource: function() {
    for(var index in SOURCES) {
      var sourceID = SOURCES[index].id;
      var harvesters = _.filter(CREEPS, (creep) => creep.memory.sourceId == sourceID);
      if(harvesters.length < 3 ) {
        return sourceID;
      }
    }
  },

  checkDangerInRoom: function() {
    if(HOSTILES.length > 0) {
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
    SOURCES = SOURCES ? SOURCES : SPAWN_ROOM.find(FIND_SOURCES_ACTIVE);
    SPAWN_QUEUE = SPAWN_QUEUE ? SPAWN_QUEUE : SPAWN_OBJ.memory['queue'];
    if (!SPAWN_QUEUE) {
      SPAWN_QUEUE = [];
    }

    TOWER_CONTROLLER = TOWER_CONTROLLER ? TOWER_CONTROLLER : towerController;

    STORAGES = SPAWN_ROOM.find(FIND_STRUCTURES, { 
      filter: (obj) => { obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE }
    });

    CREEPS = _.filter(Game.creeps, (creep) => creep.memory.owner == SPAWN_NAME);
    COMBAT_CREEPS = _.filter(CREEPS, (creep) => creep.memory.role == ROLES.solder || creep.memory.role == ROLES.ranger);
    let hostiles = SPAWN_ROOM.find(FIND_HOSTILE_CREEPS);
    if (!HOSTILES) {
      HOSTILES = [];
    }
    if (!HOSTILES[SPAWN_ROOM.name]) {
      HOSTILES[SPAWN_ROOM.name] = [];
    }
    HOSTILES[SPAWN_ROOM.name] = hostiles.length > 0 ? hostiles : false;
  },

  processing : function(spawn_obj) {
    if(spawn_obj) {
      SPAWN_NAME = spawn_obj.name;
      SPAWN_OBJ = spawn_obj;
      SPAWN_ROOM = spawn_obj.room;
    }
    this.updateDynamicVariables();
    this.getLevel();
    this.updateState();

    if (this.checkDangerInRoom()) {
      DEFEND_CONTROLLER = DEFEND_CONTROLLER ? DEFEND_CONTROLLER : defendController;
      var rangers = _.filter(CREEPS, (creep) => creep.memory.role == ROLES.repairer);
      DEFEND_CONTROLLER.processing(SPAWN_ROOM, HOSTILES, COMBAT_CREEPS, rangers);
      TOWER_CONTROLLER.processing(this.getState(), SPAWN_ROOM, HOSTILES);
    }

    this.check_and_spawnd_creep();
    this.creep_doing();
    this.spawnQueqe();
    if (!this.checkDangerInRoom()) {
      TOWER_CONTROLLER.processing(this.getState(), SPAWN_ROOM, HOSTILES);
    }
  }
};
