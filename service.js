var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
    name:'Mallatex_api',
    description: 'Api para el gestor de ordenes web de Mallatex',
    script: './index.js',
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
  ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();