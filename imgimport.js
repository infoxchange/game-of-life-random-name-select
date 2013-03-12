var child_process = require('child_process');
var gravatar = require('gravatar');
var http = require('http');
var fs = require('fs');

function importGravatar(email, callback) {
  var url = gravatar.url(email);
  var filename = email + ".jpeg";
  var wget = child_process.spawn('wget', [url, '-O', filename]);
  wget.stdout.on('close', function () {
    importImage(filename, callback);
  });
}

function importImage(file, callback) {
  var p = child_process.spawn("./image-manip.sh", [file]);
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
exports.importGravatar = importGravatar;
