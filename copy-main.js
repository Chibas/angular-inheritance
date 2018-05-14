var fs = require('fs-extra');

var source = './web/main.php';
var dest = './views/layouts/main.php';

fs.move(source, dest, {overwrite: true}, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Moved from '+source+' to ' + dest);
});