var room_proc = require('room.proc');
var memory_checked = require('memory.checked');

module.exports.loop = function() {
    memory_checked.checkMemory();
    room_proc.processing();
}