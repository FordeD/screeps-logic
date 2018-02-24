var spawns_proc = require('spawn.proc');
var memory_checked = require('memory.checked');

module.exports.loop = function() {
    memory_checked.checkMemory();
    spawns_proc.processing();
}