var room_proc = require('room.proc');
var memory_checked = require('memory.checked');

module.exports.loop = function() {
    room_proc.processing();
    memory_checked.checkMemory();
}