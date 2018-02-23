module.exports.loop = function () {
    var workers = Game.creeps.map(function(creep) {
       if(creep.memory.role == 'worker') {
           return creep;
       } 
    });
    var upgraders = Game.creeps.map(function(creep) {
       if(creep.memory.role == 'upgrader') {
           return creep;
       } 
    });

    
    if (Game.spawns.Spawn1.energyCapacity > 100) {
        if(workers.length < 4) {
            let creepNumber = Game.creeps.length+1;
            Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], 'worker'+creepNumber);
            Game.creeps['worker'+creepNumber].memory.role = 'worker';
        }
        
        if(upgraders.length < 1) {
            let creepNumber = Game.creeps.length+1;
            Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE], 'upgrader'+creepNumber);
            Game.creeps['upgrader'+creepNumber].memory.role = 'upgrader';
        }
    }
    
    // Перебор крипов
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
    }
}