var spawns_proc = require('spawn.proc');
var memory_checked = require('memory.checked');

module.exports.loop = function() {
    spawns_proc.processing();
    memory_checked.checkMemory();
}