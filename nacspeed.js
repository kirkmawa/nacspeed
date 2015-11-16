var ini = require ("node-ini");
var radius = require ("node-radius");
var fs = require("fs");
var zpad = require ("zpad");
var strftime = require ("strftime");
var Tail = require ("node-tail").Tail;
var dgram = require ("dgram");

// Create the UDP client
var client = dgram.createSocket("udp4");


// Read the config file
var nsini = ini.parseSync('./config/config.ini');

// FUNCTIONS

// Find latest file. Used at startup and when nacspeed determines the log has been rotated
// Sync function. Returns path of latest end-system event logfile.
function findLatestFile (dirpath) {
	var n = 0;
	while (n < 20) {
		n++;
		try {
			fs.statSync(dirpath + "NetSight/appdata/logs/" + strftime("nacESE.%Y_%m_%d_") + zpad(n) + ".log").isFile();
		}
		catch (err) {
			n--;
			break;
		}
	}
	return dirpath + "NetSight/appdata/logs/" + strftime("nacESE.%Y_%m_%d_") + zpad(n) + ".log";
}

// Process nacESE log file line
function nacese (line) {
	// This is tab-delimited, we need to split this string
	var fields = line.split("\t");
	if (fields[5] == "AUTH_MAC_PAP") {
		if (fields[2] == "<null/>" || fields[8] == "<empty/>") {
			console.log ("discarded empty nacESE entry");
		} else {
			console.log ("processed nacESE entry from " + fields[2] + " " + fields[8] + " (" + fields[6] + ")");
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



var logfile = findLatestFile (nsini.nacspeed.nsroot);

tail = new Tail(logfile);

tail.on("line", function(data) {
  nacese (data);
});


