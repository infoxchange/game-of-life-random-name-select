// a data matrix is a two-dimensional JS array (first by y, then by x)
// user id is arbitrary string
// usage:
// addJob({ user: "someone@gmail.com", data: [[0,1,0],[1,0,0],[0,1,1]] });
// run(); // runs one job only
// newdata = last("someone@gmail.com");

// Queue management

var queue = []; // array by cycles, then hashes by user

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

var state = {}; // hash by user ID, then array by cycle number, then bit matrix

function addJob(input) {
  var user = input.user;
  var data = input.data;
  state[user] = [data];
  _addJob(user, 0);
}

function last(user) { // return { cycle: integer, data: bit matrix }
  var userdata = state[user];
  if (typeof(userdata) === 'undefined') return {};
  var cycle = state[user].length - 1;
  return state[user][cycle];
}

function users() {
  var res = [];
  for (var u in state) {
    if (state.hasOwnProperty(u)) {
      res.push(u);
    }
  }
  return res;
}

function all() {
  var res = {};
  for (var u in state) {
    if (state.hasOwnProperty(u)) {
      res[u] = last(u);
    }
  }
  return res;
}

function score(user) {
  var data = last(user);
  var res = 0;
  for (var y = 0; y < data.length; y++) {
    for (var x = 0; x < data.length; x++) {
      if (data[y][x]) { res++; }
    }
  }
  return res;
}

function draw() {
  var max = undefined;
  var res = false;
  for (var u in state) {
    if (state.hasOwnProperty(u)) {
      var us = score(u);
      if (typeof(max) === 'undefined') {
        max = us;
      } else if (max == us) {
        res = true;
      } else if (max < us) {
        max = us;
        res = false;
      }
    }
  }
  return res;
}

// Actual running

var timers = require('timers');

var scheduled = false;

var min_iterations = 1000;

var per_timer = 1000;

function start() {
  if (scheduled) return;
  timers.setTimeout(run, 0);
  scheduled = true;
}

function run() {
  scheduled = false;
  var job = _getJob();
  if (typeof(job) === 'undefined') {
    return;
  }
  var user = job.user;
  var cycle = job.cycle;
  if (cycle >= min_iterations) {
    return;
  }
  var data = state[user][cycle];
  var newdata = process(data);
  cycle++;
  state[user][cycle] = newdata;
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
  var height = data.length;
  var width = data[0].length;
  var newdata = Array(height);
  for (var y = 0; y < height; y++) {
    newdata[y] = Array(width);
    for (var x = 0; x < width; x++) {
      var around =
        n(data, x - 1, y - 1) +
        n(data, x - 1, y  ) +
        n(data, x - 1, y + 1) +
        n(data, x  , y - 1) +
        n(data, x  , y + 1) +
        n(data, x + 1, y - 1) +
        n(data, x + 1, y  ) +
        n(data, x + 1, y + 1);

      var res;
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
exports.draw = draw;
exports.currentCycle = currentCycle;
exports.last = last;
exports.run = run;
exports.score = score;
exports.users = users;
