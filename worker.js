// a data matrix is a two-dimensional JS array (first by y, then by x)
// user id is arbitrary string
// usage:
// addjob({ user: "someone@gmail.com", data: [[0,1,0],[1,0,0],[0,1,1]] });
// run(); // runs one job only
// newdata = last("someone@gmail.com");

var state = {}; // hash by user ID, then array by cycle number, then bit matrix

var queue = []; // array of { user: string, cycle: integer }

function addjob(input) {
    var user = input.user;
    var data = input.data;
    state[user] = [data];
    queue.push({ user: user, cycle: 0 });
}

function last(user) { // return { cycle: integer, data: bit matrix }
    var cycle = state[user].length - 1;
    return state[user][cycle];
}

function run() {
    var job = queue.shift();
    var user = job.user;
    var cycle = job.cycle;
    var data = state[user][cycle];
    var newdata = process(data);
    cycle++;
    state[user][cycle] = newdata;
    queue.push({ user: user, cycle: cycle });
}

function n(v) {
    return typeof v === 'undefined' ? 0 : v;
}

function process(data) {
    var height = data.length;
    var width = data[0].length;
    var newdata = Array(height);
    for (var y = 0; y < height; y++) {
        newdata[y] = Array(width);
        for (var x = 0; x < width; x++) {
            var around =
                n(data[y - 1][x - 1]) +
                n(data[y - 1][x    ]) +
                n(data[y - 1][x + 1]) +
                n(data[y    ][x - 1]) +
                n(data[y    ][x + 1]) +
                n(data[y + 1][x - 1]) +
                n(data[y + 1][x    ]) +
                n(data[y + 1][x + 1]);

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

exports.addjob = addjob;
exports.last = last;
exports.run = run;
