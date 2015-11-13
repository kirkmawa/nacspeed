nacspeed
========
##### A utility to send Extreme Networks' NAC authentications to Lightspeed

This tool is for districts that have NAC in conjunction with another 802.1x network not 
associated with the NAC. It will send NAC authentications to the RADIUS accounting 
server on the Rocket.

Extreme has a similar utility called OpenFabric Connect that does pretty much the same 
thing. The only problem is, you don't have aany options to filter out messages from the NAC 
end-system log. (For example, in my district, I have a separate SSID for machine cert 
authentication and all those are sent to Lightspeed.)

### Prerequisites
- Node.js 0.8.0

### Acknowledgements
- Includes [node-ini](https://github.com/pastorbones/node-ini) by Roger Mayfield (MIT license)
- Includes [node-radius](https://github.com/retailnext/node-radius) by Nearbuy Systems (BSD license)
- Includes [node-tail](https://github.com/lucagrulla/node-tail) by Luca Grulla (MIT license)
- Includes [zpad](https://github.com/Daiz/zpad) (public domain)
- Includes [strftime](https://github.com/samsonjs/strftime) by Sami Samhuri (MIT license)


