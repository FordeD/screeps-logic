module.exports = {
  dangerNotify: function(username, roomName) {
    Game.notify(`User ${username} spotted in room ${roomName}`);
  }
}