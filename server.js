var connect = require('connect');
var serveStatic = require('serve-static');

connect()
    .use(serveStatic(__dirname + '/dist'))
    .listen(5000, () => console.log('Server running on 5000...'));