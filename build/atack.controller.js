module.exports = {
  processing: function (room, hostles, solders, SPAWN_MEMORY) {
    let roomName = room.name;
    solders.forEach(creep => this.solderDefend(creep));
  },

  solderAtack: function (creep) {
    var target = null;
    if (!creep.memory.targetHostile) {
      target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
      if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES)
      }
    } else {
      target = creep.memory.targetHostile;
    }
    if (target) {
      creep.memory.targetHostile = target;
      result = creep.attack(target);
      if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, SPAWN_MEMORY.CREEP_MOVE_ATACK)
      } else if (result == ERR_INVALID_TARGET) {
        creep.memory.targetHostile = null;
      }
    } else {
      creep.memory.targetHostile = null;
    }
  }
}