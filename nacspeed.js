var ini = require ("node-ini");
var radius = require ("node-radius");
var fs = require("fs");
var zpad = require ("zpad");
var strftime = require ("strftime");
var Tail = require ("node-tail").Tail;
var dgram = require ("dgram");
var watch = require ("watch");
var path = require ("path");

// Check for node version before proceeding
if (process.versions.node < '0.8.0') {
	console.log ("This software requires node 0.8.0 or newer, this is " + process.version);
	process.exit(1);
}

console.log ("nacspeed starting up");

// Read the config file
console.log ("reading config file");
try {
	var nsini = ini.parseSync(path.normalize('./config/config.ini'));
} catch (e) {
	console.log ("Failed to read config/config.ini. Perhaps you forgot to rename and edit config-start.ini");
	process.exit(1);
}

// Exit if the config file is not edited
if (nsini.nacspeed.icanread == "false") {
	console.log ("Make sure you edit the config file");
	process.exit(1);
}

// Create the UDP client
var client = dgram.createSocket("udp4");

// FUNCTIONS

// Find latest file. Used at startup and when nacspeed determines the log has been rotated
// Sync function. Returns path of latest end-system event logfile.
function findLatestFile (dirpath) {
	var n = 0;
	while (n < 20) {
		n++;
		try {
			fs.statSync(path.normalize(dirpath + "NetSight/appdata/logs/" + strftime("nacESE.%Y_%m_%d_") + zpad(n) + ".log")).isFile();
		}
		catch (err) {
			n--;
			break;
		}
	}
	if (nsini.nacspeed.logging > 0) {
		console.log ("using " + path.normalize (dirpath + "NetSight/appdata/logs/" + strftime("nacESE.%Y_%m_%d_") + zpad(n) + ".log"));
	}
	return path.normalize (dirpath + "NetSight/appdata/logs/" + strftime("nacESE.%Y_%m_%d_") + zpad(n) + ".log");
}

// Process nacESE log file line
function nacese (line) {
	// This is tab-delimited, we need to split this string
	var fields = line.split("\t");
	if (fields[5] == "AUTH_MAC_PAP") {
		if (fields[2] == "<null/>" || fields[8] == "<empty/>") {
			if (nsini.nacspeed.logging > 1) {
				console.log ("discarded empty nacESE entry");
			}
		} else {
			if (nsini.nacspeed.logging > 1) {
				console.log ("processed nacESE entry from " + fields[2] + " " + fields[8] + " (" + fields[6] + ")");
			}
			sendRadiusLogin (fields[8], fields[2]);
		}
	}
}

// Construct and send RADIUS accounting packet
function sendRadiusLogin (username, framedip) {
	var packet = radius.encode({
	  code: "Accounting-Request",
	  secret: nsini.nacspeed.radius_ss,
	  attributes: [
		['User-Name', username],
		['Framed-IP-Address', framedip],
		['NAS-IP-Address', '0.0.0.0'],
		['NAS-Port', '0'],
		['NAS-Port-Type', 'Wireless-Other'],
		['Acct-Status-Type', 'Start']
	  ]
	});	
	
	client.send(packet, 0, packet.length, 1813, nsini.nacspeed.lsip);
	
}

watch.createMonitor(path.normalize(nsini.nacspeed.nsroot + "NetSight/appdata/logs/"), function (monitor) {
	monitor.on("created", function (f, stat) {
    	// Handle new files
    	if (nsini.nacspeed.logging > 0) {
			console.log ("warning: log file has been rotated, finding new file");
    	}
		tail.unwatch();
		var logfile = findLatestFile (path.normalize(nsini.nacspeed.nsroot));

		tail = new Tail(logfile);

		tail.on("line", function(data) {
			nacese (data);
		});
	});
});

var logfile = findLatestFile (path.normalize(nsini.nacspeed.nsroot));

tail = new Tail(logfile);

tail.on("line", function(data) {
  nacese (data);
});


