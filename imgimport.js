var spawn = require('child_process').spawn;

function importImage(file, callback) {
  var p = spawn("./image-manip.sh", [file]);
  var res = "";
  p.stdout.on('data', function (data) { res += data; });
  p.stdout.on('close', function () {
    res = res.split('\n');
    var data = Array(res.length);
    for (var i = 0; i < res.length; i++) {
      var str = res[i];
      data[i] = [];
      for (var j = 0; j < str.length; j++) {
        data[i].push(str[j] === '0' ? 0 : 1);
      }
    }
    callback(data);
  });
}

exports.importImage = importImage;
