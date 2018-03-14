module.exports = {
  processing: function(roomStatus, room, hostles) {
    var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

    if (roomStatus == ROOM_STATES.DEFEND && hostles.length > 0) {
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
        var needRepairStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(obj) { 
            if(tower.id == obj.id) {
                return false;
            }
            return obj.hits < obj.hitsMax;
          }
        });
        if(needRepairStructure && tower.energy > 500) {
            tower.repair(needRepairStructure);
        }
    }
  }
}