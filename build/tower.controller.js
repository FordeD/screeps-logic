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
        tower.heal(woundedCreep);
    } else {
        var needRepairStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: function(obj) { 
            return obj.hits < obj.hitsMax;
          }
        });
        if(needRepairStructure) {
            tower.repair(needRepairStructure);
        }
    }
  }
}