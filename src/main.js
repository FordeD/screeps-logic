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

const SPAWN_1  = "Spawn1";
var   SPAWN_OBJ = null;

const HARVESTER_BODY = [MOVE, WORK, WORK,  CARRY];
const CL_UPGRADER_BODY = [MOVE, WORK, CARRY, CARRY, CARRY];


const HARVESTER_MAX_COUNT    = 4;
const CL_UPGRADER_MAX_COUNT  = 4;

var HARVESTER_COUNT    = 0;
var CL_UPGRADER_COUNT  = 0;

module.exports.loop = function()
{
    if(Game.spawns[SPAWN_1])
    {
        SPAWN_OBJ = Game.spawns[SPAWN_1];
        
        // CHECK AND CREATE WORKERS  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if( !SPAWN_OBJ.spawning && SPAWN_OBJ.energy >= 300)
        {
            HARVESTER_COUNT    = 0;
            CL_UPGRADER_COUNT  = 0;

            for(var i in Game.creeps)
            {
                var cr = Game.creeps[i];
                if(cr.memory.role == 'harvester')
                {
                    ++HARVESTER_COUNT;
                    continue;
                }
                
                if(cr.memory.role == 'cl_upgrader')
                {
                    ++CL_UPGRADER_COUNT;
                    continue;
                }
            }
            
            if(HARVESTER_COUNT < HARVESTER_MAX_COUNT)
            {
                if(SPAWN_OBJ.canCreateCreep(HARVESTER_BODY) == OK)
                {
                    var res;
                    res = SPAWN_OBJ.createCreep(HARVESTER_BODY, null,  {role : 'harvester', isTransfer : false});
                    if(_.isString(res))
                        console.log("Creating a harvester '" + res + "' was startes");
                    else
                        console.log("Harvester spawn error: " + res);
                }
            }
            else
            if(CL_UPGRADER_COUNT < CL_UPGRADER_MAX_COUNT)
            {
                if(SPAWN_OBJ.canCreateCreep(CL_UPGRADER_BODY) == OK)
                {
                    var res;
                    res = SPAWN_OBJ.createCreep(CL_UPGRADER_BODY, null,  {role : 'cl_upgrader', isTransfer : false});
                    if(_.isString(res))
                        console.log("Creating a controller upgrader '" + res + "' was started");
                    else
                        console.log("Controller upgrader spawn error: " + res);
                }
            }
        }
        
        // WORKERS PROCESSING >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        
        for(var name in Game.creeps)
        {
            var creep    = Game.creeps[name];
            var total = _.sum(creep.carry);


            if(total == 0 )
            creep.memory.isTransfer = false;
                
            if( (total < creep.carryCapacity) && (!creep.memory.isTransfer))
            {
                var pos = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(pos)
                {
                    if(creep.harvest(pos) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(pos);
                    }
                }
            }
            
            if(total >= creep.carryCapacity)
            creep.memory.isTransfer = true;            

            if(creep.memory.isTransfer)
            {            
                switch(creep.memory.role)
                {
                    case 'harvester':
                    {
                        if(SPAWN_OBJ.energy < SPAWN_OBJ.energyCapacity)
                        {
                            var res;
                            res = creep.transfer(SPAWN_OBJ, RESOURCE_ENERGY);
                            if(res == ERR_NOT_IN_RANGE) {
                                creep.moveTo(SPAWN_OBJ);
                            }
                        }
                        else
                        {
                            if(creep.room.controller)
                            {
                                
                                var res = creep.upgradeController(creep.room.controller);
                                if(res == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(creep.room.controller);
                                }
                            }
                            
                        }
                        break;
                    }
                    case 'cl_upgrader':
                    {
                        if(creep.room.controller)
                        {
                            
                            var res = creep.upgradeController(creep.room.controller);
                            if(res == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller);
                            }
                        }
                    }
                }
            }
        }
    
        // WORKERS PROCESSING <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<        
    }
}