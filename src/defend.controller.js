module.exports = {
  processing: function(room) {
    var hostiles = room.find(FIND_HOSTILE_CREEPS);
    let roomName = room.name;
    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        var towers = room.find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
  }
}