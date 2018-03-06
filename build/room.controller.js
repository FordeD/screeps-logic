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

const SPAWN_QUEUE_MAX = 16;

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

const ROLES = {harvester: 'harvester', upgrader: 'cl_upgrader', builder: 'ex_builder', solder: 'solder'};

const HARVESTER_BODY_ECO = [MOVE, WORK, CARRY];
const CL_UPGRADER_BODY_ECO = [MOVE, WORK, CARRY];

const HARVESTER_MAX_COUNT    = [5,5,3,3];
const CL_UPGRADER_MAX_COUNT  = [5,7,2,2];
const EX_BUILDER_MAX_COUNT   = [5,3,4,5];
const SOLDER_MAX_COUNT       = [3,1,7,5];

var CREEP_LEVEL              = 0;
var CONTROLLER_LEVEL         = 0;

var HARVESTER_COUNT          = 0;
var CL_UPGRADER_COUNT        = 0;
var EX_BUILDER_COUNT         = 0;
var SOLDER_COUNT             = 0;

var HARVESTER_QUEUE_COUNT    = 0;
var CL_UPGRADER_QUEUE_COUNT  = 0;
var EX_BUILDER_QUEUE_COUNT   = 0;
var SOLDER_QUEUE_COUNT       = 0;


const CREEP_MOVE_LINE        = {visualizePathStyle: {stroke: '#ffffff'}};

module.exports = {
  create_harvester:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: HARVESTER_BODY[CREEP_LEVEL], memory: {role : ROLES.harvester, isTransfer : false}});
      console.log("Add to queue a harvester. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_controller_upgrader:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: CL_UPGRADER_BODY[CREEP_LEVEL], memory: {role : ROLES.upgrader, isTransfer : false}});
      console.log("Add to queue a cl_upgrader. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_builder_extension:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: EX_BUILDER_BODY[CREEP_LEVEL], memory: {role : ROLES.builder, isTransfer : false, isBuilding : false}});
      console.log("Add to queue a ex_builder. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_solder:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: SOLDER_BODY[CREEP_LEVEL], memory: {role : ROLES.solder, target: SPAWN_OBJ.room.name}});
      console.log("Add to queue a solder. Queue: "+SPAWN_QUEUE.length);
    }
  },

  spawnQueqe:function() {
    if( !SPAWN_OBJ.spawning && SPAWN_OBJ.energy >= 300 && SPAWN_QUEUE.length > 0) {
      switch(ROOM_STATE) {
        case ROOM_STANDART:
        case ROOM_EVOLUTION: {
          var creep = SPAWN_QUEUE.shift();
          this.setSpawning(creep);
          break;
        }
        case ROOM_DEFEND:
        case ROOM_ATACK: {
          var creep = SPAWN_QUEUE.splice(SPAWN_QUEUE.findIndex(e => e.memory.role == ROLES.solder),1);
          this.setSpawning(creep);
        }
      }
    } else if (Game.creeps.length = 0 && SPAWN_OBJ.energy < 300) {
      res = SPAWN_OBJ.createCreep(HARVESTER_BODY_ECO, null, {role : ROLES.harvester, isTransfer : false});
      if(_.isString(res)) {
        console.log("Creating a ECO harvester '" + res + "' was started");
      } else {
        console.log("ECO harvester spawn error: " + res);
      }
      SPAWN_QUEUE = [];
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
    
    if((total < creep.carryCapacity) && (!creep.memory.isTransfer)) {
      var res_pos = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if(res_pos) {
        if(creep.harvest(res_pos) == ERR_NOT_IN_RANGE) {
          creep.moveTo(res_pos, CREEP_MOVE_LINE);
        }
        return;
      }
    }

    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
    }

    if(creep.memory.isTransfer) {
      if(SPAWN_OBJ.energy < SPAWN_OBJ.energyCapacity) {
        res = creep.transfer(SPAWN_OBJ, RESOURCE_ENERGY);
        if(res == ERR_NOT_IN_RANGE) {
          creep.moveTo(SPAWN_OBJ, CREEP_MOVE_LINE);
        }
      } else {
        var res = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function(obj) { 
            if(obj.structureType == STRUCTURE_EXTENSION ) {
              return obj.energy < obj.energyCapacity;
            }
            return false;
          }
        });
        if(res) {
          if(creep.transfer(res, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
          creep.moveTo(res, CREEP_MOVE_LINE);
        } else if(creep.room.controller && !SPAWN_OBJ.spawning) {
          var res = creep.upgradeController(creep.room.controller);
          if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, CREEP_MOVE_LINE);
          }
        }
      }
    }    
  },

  cl_upgrader_doing:function(creep) {
    var total = _.sum(creep.carry);
    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if((total < creep.carryCapacity) && (!creep.memory.isTransfer)) {
      var res_pos = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if(res_pos) {
        if(creep.harvest(res_pos) == ERR_NOT_IN_RANGE) {
          creep.moveTo(res_pos, CREEP_MOVE_LINE);
        }
        return;
      }
    }

    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
    }

    if(creep.memory.isTransfer) {
      if(creep.room.controller) {
        var res = creep.upgradeController(creep.room.controller);
        if(res == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller, CREEP_MOVE_LINE);
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
      var res_pos = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if(res_pos) {
        if(creep.harvest(res_pos) == ERR_NOT_IN_RANGE)
          creep.moveTo(res_pos, CREEP_MOVE_LINE);
        return;
      }
    }

    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
    }

    if(!creep.memory.isTransfer && !creep.memory.isBuilding) {
      console.log(total + " " + creep.memory.isTransfer + " " + creep.memory.isBuilding)
      return;
    }

    if(!creep.memory.exTarget) {
      var res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_EXTENSION } });
      
      if(res) {
        creep.memory.isBuilding = true;
        creep.memory.exTarget = res.id;
      } else {
        res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_TOWER } });
        if(res) {
          creep.memory.isBuilding = true;
          creep.memory.exTarget = res.id;
        } else {
          res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_WALL } });
          if(res) {
            creep.memory.isBuilding = true;
            creep.memory.exTarget = res.id;
          } else {
            res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_RAMPART } });
            if(res) {
              creep.memory.isBuilding = true;
              creep.memory.exTarget = res.id;
            } else {
              creep.memory.isBuilding = false;
              creep.memory.isTransfer = true;
            }
          }
        }
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
      this.harvester_doing(creep);
    }    
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

  check_and_spawnd_creep:function() {
    if( SPAWN_QUEUE.length < SPAWN_QUEUE_MAX ) {
      HARVESTER_COUNT    = 0;
      CL_UPGRADER_COUNT  = 0;
      EX_BUILDER_COUNT   = 0;

      for(var name in Game.creeps) {
        var creep = Game.creeps[name];
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
      }

      // if (SOLDER_COUNT > SOLDER_MAX_COUNT[ROOM_STATE] && ( ROOM_STATE != ROOM_DEFEND || ROOM_STATE != ROOM_ATACK )) {
      //   var solders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLES.solder);
      //   let removed = SOLDER_COUNT - SOLDER_MAX_COUNT[ROOM_STATE];
      //   for (var i = removed; i > 0; i--) {
      //     var creep = solders.shift();
      //     creep.suicide();
      //   }
      //   SOLDER_COUNT = solders.length;
      // }
    }     
  },

  creep_doing:function() {
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
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
        }
      }
    }      
  },

  getLevel: function() {
    max = SPAWN_OBJ.room.energyCapacityAvailable
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

  checkHostlesInRoom: function() {
    var HOSTILES = SPAWN_ROOM.find(FIND_HOSTILE_CREEPS);
    if(HOSTILES.length > 0) {
      ROOM_STATE = ROOM_DEFEND;
      DEFEND_CONTROLLER = require('defend.controller');
    }
  },

  processing : function(spawn_obj) {
    SPAWN_NAME = spawn_obj.name;
    SPAWN_OBJ = spawn_obj;
    SPAWN_ROOM = spawn_obj.room;

    this.getLevel();
    if (CREEP_LEVEL < 2 && SPAWN_ROOM.controller.level < 5) {
      ROOM_STATE = ROOM_EVOLUTION;
    } // else if (CREEP_LEVEL > 5) {
    //   ROOM_STATE = ROOM_ATACK;
    // }

    this.checkHostlesInRoom();
    if (DEFEND_CONTROLLER) {
      var solders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLES.solder);
      DEFEND_CONTROLLER.processing(SPAWN_ROOM, HOSTILES, solders);
    }

    SPAWN_QUEUE = SPAWN_OBJ.memory['queue'];
    if (!SPAWN_QUEUE) {
      SPAWN_QUEUE = [];
    }

    this.spawnQueqe();
    this.check_and_spawnd_creep();
    this.creep_doing();
  }
};