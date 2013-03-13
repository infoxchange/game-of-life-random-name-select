// a data matrix is a two-dimensional JS array (first by y, then by x)
// user id is arbitrary string
// usage:
// addJob({ user: "someone@gmail.com", data: [[0,1,0],[1,0,0],[0,1,1]] });
// run(); // runs one job only
// newdata = last("someone@gmail.com");

// Queue management
var fs = require('fs'),
    fsw = require('wrench'),
    timers = require('timers'),
    queue = []; // array by cycles, then hashes by user

function _addJob(user, cycle) {
  queue[cycle] = queue[cycle] || [];
  queue[cycle].push(user);
}

function currentCycle() {
  for (var i = 0; i < queue.length; i++) {
    if (queue[i].length)
      return i;
  }
  return queue.length;
}

function _getJob() {
  for (var i = 0; i < queue.length; i++) {
    if (queue[i].length)
      return { cycle: i, user: queue[i].shift() };
  }
  return undefined;
}

// State management

//var state = {}; // hash by user ID, then array by cycle number, then bit matrix
function state(user, cycle, data) {
  var dirname = 'games/' + user,
      filename = dirname + '/' + cycle,
      encoding = 'utf8';

  fsw.mkdirSyncRecursive(dirname);

  //
  // If data param is set, read and parse JSON to return
  // If data param is not set, stringify data and write to disk
  //
  if (typeof(data) === 'undefined') {
    if (!fs.existsSync(filename))
      return {};

    return JSON.parse(
      fs.readFileSync(filename, {
        flag: 'r',
        encoding: encoding
      })
    );
  } else {
    //
    // This has changed format at some point after node 0.6!...
    // Don't be confused and spend like a whole friggen hour
    // figuring out what's happening!
    //
    return fs.writeFileSync(filename, JSON.stringify(data));
  }
}

function addJob(input) {
  var user = input.user,
      data = input.data;
  state(user, 0, data);
  _addJob(user, 0);
}

function last(user) { // return { cycle: integer, data: bit matrix }
  var dirname = 'games/' + user,
      dirList, fn, cycle;

  fsw.mkdirSyncRecursive(dirname);

  dirList = fs.readdirSync(dirname);
  for (fn in dirList) {
    if (!dirList.hasOwnProperty(fn)) continue;

    fn = parseInt(fn, 10);
    if (!isNan(fn) && fn > cycle)
      cycle = fn;
  }

  return state(user, cycle);
}

function users() {
  var dirList, fn, res = [];

  fsw.mkdirSyncRecursive('games');
  dirList = fs.readdirSync('games');
  return dirList;
}

function all() {
  var res = {},
      userList = users(),
      lastData;
  for (var u in userList) {
    if (!userList.hasOwnProperty(u)) continue;

    lastData = last(u);
    res[u] = {
      user: u,
      cycle: lastData.cycle,
      data: lastData,
      score: score(lastData),
    }
  }
  return res;
}

function score(data) {
  var res = 0;
  for (var y = 0; y < data.length; y++) {
    for (var x = 0; x < data.length; x++) {
      if (data[y][x]) { res++; }
    }
  }
  return res;
}
function userScore(user) {
  return score(last(user));
}

function draw() {
  var max = undefined,
      res = false,
      usersList = users(),
      us;
  for (var u in usersList) {
    if (!users.hasOwnProperty(u)) continue;
    
    us = userScore(u);
    if (typeof(max) === 'undefined') {
      max = us;
    } else if (max == us) {
      res = true;
    } else if (max < us) {
      max = us;
      res = false;
    }
  }
  return res;
}

function clear() {
  queue = [];
  fsw.rmdirSyncRecursive('games', true);
}

// Actual running

var scheduled = false;

var min_iterations = 1000;

function start() {
  if (scheduled) return;
  timers.setTimeout(run, 10);
  scheduled = true;
}

function run() {
  var scheduled = false,
      job = _getJob(),
      user, cycle, data, newdata;
  
  if (typeof(job) === 'undefined') return;

  user = job.user;
  cycle = job.cycle;
  if (cycle >= min_iterations) {
    return;
  }

  data = state(user, cycle);
  newdata = process(data);

  cycle++;
  state(user, cycle, newdata);

  _addJob(user, cycle);
  start();
}

// Processing

function n(data, x, y) {
  var r = data[y];
  if (typeof r === 'undefined') return 0;
  r = r[x];
  return typeof r === 'undefined' ? 0 : r;
}

function process(data) {
  var height = data.length,
      width = data[0].length,
      newdata = Array(height),
      y, x, around, res;
  for (y = 0; y < height; y++) {
    newdata[y] = Array(width);
    for (x = 0; x < width; x++) {
      around =
        n(data, x - 1, y - 1) +
        n(data, x - 1, y  ) +
        n(data, x - 1, y + 1) +
        n(data, x  , y - 1) +
        n(data, x  , y + 1) +
        n(data, x + 1, y - 1) +
        n(data, x + 1, y  ) +
        n(data, x + 1, y + 1);

      res;
      if (around < 2 || around > 3)
        res = 0;
      else if (around == 3)
        res = 1;
      else
        res = data[y][x];

      newdata[y][x] = res;
    }
  }
  return newdata;
}

exports.addJob = addJob;
exports.all = all;
exports.clear = clear;
exports.draw = draw;
exports.currentCycle = currentCycle;
exports.last = last;
exports.run = run;
exports.score = score;
exports.users = users;
