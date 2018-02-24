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
        
        harvester           - [MOVE, WORK, WORK,  CARRY]
        cl_upgrader         - [MOVE, WORK, CARRY, CARRY, CARRY]
*/

const SPAWN_NAME  = "Spawn1";
var   SPAWN_OBJ = null;

const HARVESTER_BODY = [MOVE, WORK, WORK,  CARRY];
const CL_UPGRADER_BODY = [MOVE, WORK, CARRY, CARRY, CARRY];
const EX_BUILDER_BODY = [MOVE, WORK, CARRY, CARRY, CARRY];


const HARVESTER_MAX_COUNT    = 4;
const CL_UPGRADER_MAX_COUNT  = 4;
const EX_BUILDER_MAX_COUNT   = 4;

var HARVESTER_COUNT    = 0;
var CL_UPGRADER_COUNT  = 0;
var EX_BUILDER_COUNT   = 0;

module.exports.loop = {
  create_harvester:function() {
    var res;
    res = SPAWN_OBJ.createCreep(HARVESTER_BODY, null,  {role : 'harvester', isTransfer : false});
    if(_.isString(res)) {
      console.log("Creating a harvester '" + res + "' was startes");
    } else {
      console.log("Harvester spawn error: " + res);
    } 
  },

  create_controller_upgrader:function() {
    var res;
    res = SPAWN_OBJ.createCreep(CL_UPGRADER_BODY, null,  {role : 'cl_upgrader', isTransfer : false});
    if(_.isString(res)) {
      console.log("Creating a controller upgrader '" + res + "' was started");
    } else {
      console.log("Controller upgrader spawn error: " + res);
    }
  },

  create_builder_extension:function() {
    var res;
    res = SPAWN_OBJ.createCreep(EX_BUILDER_BODY, null,  {role : 'ex_builder', isTransfer : false, isBuilding : false});
    if(_.isString(res)) {
      console.log("Creating a extensions builder '" + res + "' was started");
    } else {
      console.log("extensions builde spawn error: " + res);
    }
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
        res = creep.transfer(s1_obj, RESOURCE_ENERGY);
        if(res == ERR_NOT_IN_RANGE) {
          creep.moveTo(s1_obj, {visualizePathStyle: {stroke: '#ffffff'}});
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
        } else if(creep.room.controller && !s1_obj.spawning) {
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
    if( !SPAWN_OBJ.spawning && SPAWN_OBJ.energy >= 300 ) {
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
      
      if(HARVESTER_COUNT < HARVESTER_MAX_COUNT) {
        console.log("h:" + HARVESTER_COUNT + ":"+HARVESTER_MAX_COUNT)
        this.create_harvester();
      } else if(CL_UPGRADER_COUNT < CL_UPGRADER_MAX_COUNT) {
        console.log("c:" + CL_UPGRADER_COUNT + ":"+CL_UPGRADER_MAX_COUNT)
        this.create_controller_upgrader();
      } else if(EX_BUILDER_COUNT < EX_BUILDER_MAX_COUNT) {
        console.log("b:" + EX_BUILDER_COUNT + ":"+EX_BUILDER_MAX_COUNT)
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

  processing:function() {
    SPAWN_OBJ = Game.spawns[SPAWN_NAME];
    this.check_and_spawnd_creep();
    this.creep_doing();
  }
};