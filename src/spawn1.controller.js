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

const SPAWN_NAME  = "Spawn1";
var   SPAWN_OBJ = null;
var   SPAWN_QUEUE = null;

const SPAWN_QUEUE_MAX = 10;

const HARVESTER_BODY = [MOVE, WORK, WORK,  CARRY];
const CL_UPGRADER_BODY = [MOVE, WORK, CARRY, CARRY, CARRY];
const EX_BUILDER_BODY = [MOVE, WORK, CARRY, CARRY, CARRY];


const HARVESTER_MAX_COUNT    = 4;
const CL_UPGRADER_MAX_COUNT  = 4;
const EX_BUILDER_MAX_COUNT   = 4;

var HARVESTER_COUNT    = 0;
var CL_UPGRADER_COUNT  = 0;
var EX_BUILDER_COUNT   = 0;

var HARVESTER_QUEUE_COUNT    = 0;
var CL_UPGRADER_QUEUE_COUNT  = 0;
var EX_BUILDER_QUEUE_COUNT   = 0;

module.exports = {
  create_harvester:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: HARVESTER_BODY, memory: {role : 'harvester', isTransfer : false}});
      console.log("Add to queue a harvester. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_controller_upgrader:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: CL_UPGRADER_BODY, memory: {role : 'cl_upgrader', isTransfer : false}});
      console.log("Add to queue a cl_upgrader. Queue: "+SPAWN_QUEUE.length);
    }
  },

  create_builder_extension:function() {
    if(SPAWN_QUEUE.length < SPAWN_QUEUE_MAX) {
      SPAWN_QUEUE.push({body: EX_BUILDER_BODY, memory: {role : 'ex_builder', isTransfer : false, isBuilding : false}});
      console.log("Add to queue a ex_builder. Queue: "+SPAWN_QUEUE.length);
    }
  },

  spawnQueqe:function() {
    if( !SPAWN_OBJ.spawning && SPAWN_OBJ.energy >= 300 && SPAWN_QUEUE.length > 0) {
      var creep = SPAWN_QUEUE.shift();
      var res;
      res = SPAWN_OBJ.createCreep(creep.body, null,  creep.memory);
      if(_.isString(res)) {
        console.log("Creating a " + creep.memory.role + " '" + res + "' was started. Queue: "+SPAWN_QUEUE.length);
      } else {
        console.log(creep.memory.role + " spawn error: " + res);
      }
    }

    SPAWN_OBJ.memory['queue'] = SPAWN_QUEUE;
  },

  harvester_doing:function(creep) {
    var total   = _.sum(creep.carry);    

    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if((total < creep.carryCapacity) && (!creep.memory.isTransfer)) {
      var res_pos = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if(res_pos) {
        if(creep.harvest(res_pos) == ERR_NOT_IN_RANGE) {
          creep.moveTo(res_pos, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return;
      }
    }

    if(total >= creep.carryCapacity) {
      creep.memory.isTransfer = true;
    }

    if(creep.memory.isTransfer) {
      //console.log(total + ":" + s1_obj.energy + ":" + s1_obj.energyCapacity + ":" + s1_obj.spawning)
      if(SPAWN_OBJ.energy < SPAWN_OBJ.energyCapacity) {
        res = creep.transfer(SPAWN_OBJ, RESOURCE_ENERGY);
        if(res == ERR_NOT_IN_RANGE) {
          creep.moveTo(SPAWN_OBJ, {visualizePathStyle: {stroke: '#ffffff'}});
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
          creep.moveTo(res, {visualizePathStyle: {stroke: '#ffffff'}});
        } else if(creep.room.controller && !SPAWN_OBJ.spawning) {
          var res = creep.upgradeController(creep.room.controller);
          if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }
      }
    }    
  },

  cl_upgrader_doing:function(creep) {
    var total   = _.sum(creep.carry);
    if(total == 0 ) {
      creep.memory.isTransfer = false;
    }
    
    if((total < creep.carryCapacity) && (!creep.memory.isTransfer)) {
      var res_pos = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if(res_pos) {
        if(creep.harvest(res_pos) == ERR_NOT_IN_RANGE) {
          creep.moveTo(res_pos, {visualizePathStyle: {stroke: '#ffffff'}});
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
          creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
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

    if((total < creep.carryCapacity) && (!creep.memory.isTransfer) && (!creep.memory.isBuilding)) {
      var res_pos = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if(res_pos) {
        if(creep.harvest(res_pos) == ERR_NOT_IN_RANGE)
          creep.moveTo(res_pos, {visualizePathStyle: {stroke: '#ffffff'}});
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
      var res = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: { structureType: 'extension' } });
      
      if(res) {
        creep.memory.isBuilding = true;
        creep.memory.exTarget = res.id;
      } else {
        creep.memory.isBuilding = false;
        creep.memory.isTransfer = true;
      }
    }

    if(creep.memory.exTarget) {
      var target = Game.getObjectById(creep.memory.exTarget);//Game.constructionSites[cr.memory.exTarget];
      if(target) {
        if(target.progress < target.progressTotal) {
          if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }
      } else {
        creep.memory.exTarget = null;
      }
    } else {
      creep.memory.role = 'harvester';
    }    
  },

  check_and_spawnd_creep:function() {
    if( SPAWN_QUEUE.length < SPAWN_QUEUE_MAX ) {
      HARVESTER_COUNT    = 0;
      CL_UPGRADER_COUNT  = 0;
      EX_BUILDER_COUNT   = 0;

      for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
          ++HARVESTER_COUNT;
          continue;
        }
        if(creep.memory.role == 'cl_upgrader') {
          ++CL_UPGRADER_COUNT;
          continue;
        }
        if(creep.memory.role == 'ex_builder') {
          ++EX_BUILDER_COUNT;
          continue;
        }        
      }

      for(var i in SPAWN_QUEUE) {
        if (SPAWN_QUEUE[i].memory.role == 'harvester') {
          ++HARVESTER_QUEUE_COUNT;
          continue;
        } else if (SPAWN_QUEUE[i].memory.role == 'cl_upgrader') {
          ++CL_UPGRADER_QUEUE_COUNT;
          continue;
        } else if (SPAWN_QUEUE[i].memory.role == 'ex_builder') {
          ++EX_BUILDER_QUEUE_COUNT;
          continue;
        }
      }
      
      if((HARVESTER_COUNT+HARVESTER_QUEUE_COUNT) < HARVESTER_MAX_COUNT) {
        console.log("h:" + HARVESTER_COUNT + ":"+HARVESTER_MAX_COUNT+" queue:"+HARVESTER_QUEUE_COUNT)
        this.create_harvester();
      } else if((CL_UPGRADER_COUNT+CL_UPGRADER_QUEUE_COUNT) < CL_UPGRADER_MAX_COUNT) {
        console.log("c:" + CL_UPGRADER_COUNT + ":"+CL_UPGRADER_MAX_COUNT+" queue:"+CL_UPGRADER_QUEUE_COUNT)
        this.create_controller_upgrader();
      } else if((EX_BUILDER_COUNT+EX_BUILDER_QUEUE_COUNT) < EX_BUILDER_MAX_COUNT) {
        console.log("b:" + EX_BUILDER_COUNT + ":"+EX_BUILDER_MAX_COUNT+" queue:"+EX_BUILDER_QUEUE_COUNT)
        this.create_builder_extension();
      }
    }     
  },

  creep_doing:function() {
    for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.role == 'harvester') {
        this.harvester_doing(creep);
        continue;
      }
      if(creep.memory.role == 'cl_upgrader') {
        this.cl_upgrader_doing(creep);
        continue;
      }
      if(creep.memory.role == 'ex_builder') {
        this.ex_builder_doing(creep);
        continue;
      }        
    }      
  },

  processing : function(spawn_obj) {
    SPAWN_OBJ = spawn_obj;
    SPAWN_QUEUE = SPAWN_OBJ.memory['queue'];
    if (!SPAWN_QUEUE) {
      SPAWN_QUEUE = [];
    }
    this.check_and_spawnd_creep();
    this.creep_doing();
    this.spawnQueqe();
  }
};