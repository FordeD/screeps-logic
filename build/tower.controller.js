const ROOM_STANDART   = 0;
const ROOM_EVOLUTION  = 1;
const ROOM_DEFEND     = 2;
const ROOM_ATACK      = 3;

module.exports = {
  processing: function(ROOM_STATUS, room, hostles) {
    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

    if (ROOM_STATUS == ROOM_DEFEND && hostles.length > 0) {
        towers.forEach(tower => tower.attack(hostles[0]));
    } else {
        towers.forEach(tower => this.repairOrHeal(tower));
    }
  },

  repairOrHeal: function(tower) {
    var woundedCreep = tower.pos.findClosestByRange(FIND_CREEPS, { filter: function(creep) { 
        return creep.hits < creep.hitsMax;
      }
    });
    if(woundedCreep) {
        if (Math.abs(tower.pos.x-woundedCreep.pos.x) < 20 && Math.abs(tower.pos.y-woundedCreep.pos.y) < 20) {
            tower.heal(woundedCreep);
        }
    } else {
        var needRepairStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function(obj) { 
            return obj.hits < obj.hitsMax;
          }
        });
        if(needRepairStructure) {
            if (Math.abs(tower.pos.x-needRepairStructure.pos.x) < 20 && Math.abs(tower.pos.y-needRepairStructure.pos.y) < 20) {
                tower.repair(needRepairStructure);
            }
        }
    }
  }
}