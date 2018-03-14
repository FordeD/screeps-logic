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

const ROOM_STANDART   = 0;
const ROOM_EVOLUTION  = 1;
const ROOM_DEFEND     = 2;
const ROOM_ATACK      = 3;

var   SPAWN_NAME      = "";
var   SPAWN_ROOM      = null;
var   SPAWN_OBJ       = null;
var   SPAWN_QUEUE     = null;
var   ROOM_STATE      = 0;
var   HOSTILES        = null;
var   SOURCES         = null;
var   STORAGES        = null;

const SPAWN_QUEUE_MAX = 20;
const WALL_HITS_MAX = [1000,3000,5000,20000,100000,400000,800000,2900000]

const HARVESTER_BODY  = [
  [MOVE, WORK, WORK, CARRY],
  [MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
  [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
];
const CL_UPGRADER_BODY = [
  [MOVE, WORK, CARRY, CARRY, CARRY],
  [MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
  [MOVE, MOVE, MOVE, MOVE, MOVE,  WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
];
const EX_BUILDER_BODY = [
  [MOVE, WORK, CARRY, CARRY, CARRY],
  [MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
  [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY]
];
const SOLDER_BODY = [
  [ATTACK, MOVE],
  [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE],
  [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
];
const REPAIRER_BODY = [
  [MOVE, WORK, CARRY, CARRY, CARRY],
  [MOVE, MOVE, WORK, CARRY, CARRY, CARRY, RANGED_ATTACK],
  [MOVE, MOVE, MOVE, MOVE, MOVE,  WORK, CARRY, CARRY, CARRY, CARRY, RANGED_ATTACK]
];

const ROLES = {harvester: 'harvester', upgrader: 'cl_upgrader', builder: 'ex_builder', solder: 'solder', repairer: 'repairer'};

const HARVESTER_BODY_ECO = [MOVE, WORK, CARRY];
const CL_UPGRADER_BODY_ECO = [MOVE, WORK, CARRY];

const HARVESTER_MAX_COUNT    = [5,5,3,3];
const CL_UPGRADER_MAX_COUNT  = [5,4,2,2];
const EX_BUILDER_MAX_COUNT   = [5,4,4,5];
const SOLDER_MAX_COUNT       = [3,3,7,7];
const REPAIR_MAX_COUNT       = [2,4,4,3];

var CREEP_LEVEL              = 0;
var CONTROLLER_LEVEL         = 0;
var MIN_SPAWN_ENERGY         = [300,500,700];

var HARVESTER_COUNT          = 0;
var CL_UPGRADER_COUNT        = 0;
var EX_BUILDER_COUNT         = 0;
var SOLDER_COUNT             = 0;
var REPAIR_COUNT             = 0;

var HARVESTER_QUEUE_COUNT    = 0;
var CL_UPGRADER_QUEUE_COUNT  = 0;
var EX_BUILDER_QUEUE_COUNT   = 0;
var SOLDER_QUEUE_COUNT       = 0;
var REPAIR_QUEUE_COUNT       = 0;

var CREEPS                   = null;


const CREEP_MOVE_LINE        = {visualizePathStyle: {stroke: '#ffffff'}};

module.exports = {
  create_harvester:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: HARVESTER_BODY[CREEP_LEVEL], memory: {role : ROLES.harvester, isTransfer : false, owner: SPAWN_NAME }});
      console.log("Add to queue a harvester. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_controller_upgrader:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: CL_UPGRADER_BODY[CREEP_LEVEL], memory: {role : ROLES.upgrader, isTransfer : false, owner: SPAWN_NAME }});
      console.log("Add to queue a cl_upgrader. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_builder_extension:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: EX_BUILDER_BODY[CREEP_LEVEL], memory: {role : ROLES.builder, isTransfer : false, isBuilding : false, owner: SPAWN_NAME }});
      console.log("Add to queue a ex_builder. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_solder:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: SOLDER_BODY[CREEP_LEVEL], memory: {role : ROLES.solder, target: SPAWN_ROOM.name, owner: SPAWN_NAME }});
      console.log("Add to queue a solder. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_repairer:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: REPAIRER_BODY[CREEP_LEVEL], memory: {role : ROLES.repairer, isTransfer : false, isRepair : false, target: SPAWN_ROOM.name, owner: SPAWN_NAME }});
      console.log("Add to queue a repairer. Queue: "+SPAWN_QUEUE.length);
    }
  },

  spawnQueqe:function() {
    if (!CREEPS.length && SPAWN_ROOM.energyAvailable < MIN_SPAWN_ENERGY[CREEP_LEVEL]) {
      res = SPAWN_OBJ.createCreep(HARVESTER_BODY_ECO, null, {role : ROLES.harvester, isTransfer : false, sourceId : null, owner: SPAWN_NAME });
      if(_.isString(res)) {
        console.log("Creating a ECO harvester '" + res + "' was started");
      } else {
        console.log("ECO harvester spawn error: " + res);
      }
      SPAWN_QUEUE = [];
    } else if( !SPAWN_OBJ.spawning && SPAWN_ROOM.energyAvailable >= MIN_SPAWN_ENERGY[CREEP_LEVEL] && SPAWN_QUEUE.length > 0) {
      switch(ROOM_STATE) {
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

  harvester_doing:function(creep) {
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

  cl_upgrader_doing:function(creep) {
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

  ex_builder_doing:function(creep) {
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
          return (structure.hits < ROOM_STATE == ROOM_DEFEND ? 650 : structure.hitsMax && structure.hits > 0);
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
        if( target && ( (target.structureType == STRUCTURE_WALL && target.hits < WALL_HITS_MAX[CONTROLLER_LEVEL]) || (target.structureType != STRUCTURE_WALL && target.hits < 2000 || target.hits < target.hitsMax) ) ) {
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

  check_and_spawnd_creep:function() {
    if( SPAWN_QUEUE.length < SPAWN_QUEUE_MAX ) {
      HARVESTER_COUNT    = 0;
      CL_UPGRADER_COUNT  = 0;
      EX_BUILDER_COUNT   = 0;
      REPAIR_COUNT       = 0;

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
              ++REPAIR_COUNT;
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
            ++REPAIR_QUEUE_COUNT;
            break;
          }
        }
      }
      
      if((HARVESTER_COUNT+HARVESTER_QUEUE_COUNT) < HARVESTER_MAX_COUNT[ROOM_STATE]) {
        console.log("h:" + HARVESTER_COUNT + ":"+HARVESTER_MAX_COUNT[ROOM_STATE]+" queue:"+HARVESTER_QUEUE_COUNT)
        this.create_harvester();
      } else if((CL_UPGRADER_COUNT+CL_UPGRADER_QUEUE_COUNT) < CL_UPGRADER_MAX_COUNT[ROOM_STATE]) {
        console.log("c:" + CL_UPGRADER_COUNT + ":"+CL_UPGRADER_MAX_COUNT[ROOM_STATE]+" queue:"+CL_UPGRADER_QUEUE_COUNT)
        this.create_controller_upgrader();
      } else if((EX_BUILDER_COUNT+EX_BUILDER_QUEUE_COUNT) < EX_BUILDER_MAX_COUNT[ROOM_STATE]) {
        console.log("b:" + EX_BUILDER_COUNT + ":"+EX_BUILDER_MAX_COUNT[ROOM_STATE]+" queue:"+EX_BUILDER_QUEUE_COUNT)
        this.create_builder_extension();
      } else if((SOLDER_COUNT+SOLDER_QUEUE_COUNT) < SOLDER_MAX_COUNT[ROOM_STATE]) {
        console.log("s:" + SOLDER_COUNT + ":"+SOLDER_MAX_COUNT[ROOM_STATE]+" queue:"+SOLDER_QUEUE_COUNT)
        this.create_solder();
      } else if((REPAIR_COUNT+REPAIR_QUEUE_COUNT) < REPAIR_MAX_COUNT[ROOM_STATE]) {
        console.log("s:" + REPAIR_COUNT + ":"+REPAIR_MAX_COUNT[ROOM_STATE]+" queue:"+REPAIR_QUEUE_COUNT)
        this.create_repairer();
      }
    }     
  },

  creep_doing:function() {
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
          case ROLES.solder: {
            if (ROOM_STATE != ROOM_DEFEND || ROOM_STATE != ROOM_ATACK ) {
              this.solder_doing(creep);
            }
            break;
          }
          case ROLES.repairer: {
            if (ROOM_STATE != ROOM_DEFEND) {
              this.repairer_doing(creep);
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
        Game.notify("Update creeps level!");
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

  checkHostlesInRoom: function() {
    HOSTILES = SPAWN_ROOM.find(FIND_HOSTILE_CREEPS);
    if(HOSTILES.length > 0) {
      ROOM_STATE = ROOM_DEFEND;
      DEFEND_CONTROLLER = require('defend.controller');
    }
  },

  processing : function(spawn_obj) {
    SPAWN_NAME = spawn_obj.name;
    SPAWN_OBJ = spawn_obj;
    SPAWN_ROOM = spawn_obj.room;
    CONTROLLER_LEVEL = SPAWN_ROOM.controller.level;
    SOURCES = SPAWN_ROOM.find(FIND_SOURCES_ACTIVE);
    STORAGES = SPAWN_ROOM.find(FIND_STRUCTURES, { 
      filter: (obj) => { obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE }
    });
    CREEPS = _.filter(Game.creeps, (creep) => creep.memory.owner == SPAWN_NAME);

    this.getLevel();
    if (CREEP_LEVEL < 2 && SPAWN_ROOM.controller.level < 5) {
      ROOM_STATE = ROOM_EVOLUTION;
    } // else if (CREEP_LEVEL > 5) {
    //   ROOM_STATE = ROOM_ATACK;
    // }

    this.checkHostlesInRoom();
    if (DEFEND_CONTROLLER) {
      var solders = _.filter(CREEPS, (creep) => creep.memory.role == ROLES.solder);
      var rangers = _.filter(CREEPS, (creep) => creep.memory.role == ROLES.repairer);
      DEFEND_CONTROLLER.processing(SPAWN_ROOM, HOSTILES, solders, rangers);
    }

    if (!TOWER_CONTROLLER) {
      TOWER_CONTROLLER = require('defend.controller');
    }
    TOWER_CONTROLLER.processing(ROOM_STATE, HOSTILES ? HOSTILES : false);

    SPAWN_QUEUE = SPAWN_OBJ.memory['queue'];
    if (!SPAWN_QUEUE) {
      SPAWN_QUEUE = [];
    }
    this.check_and_spawnd_creep();
    this.creep_doing();
    this.spawnQueqe();
  }
};
