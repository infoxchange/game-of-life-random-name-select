var width, height;
width = 100;
height = 100;

function initRaster(selector) {
	var table;

	table = '<table><tbody>';

	for (var j = 0; j < height; j++) {
		table += '<tr>';
		for (var i = 0; i < width; i++)	{
			table += '<td class="' + 'pixel-' + i + '-' + j + '"></td>';
		}
		table += '</tr>';
	}
	table += '</tbody></table>';

	$(selector).html(table);
}

function updateRaster(selector, data){
	var pos = 0;

	$('td', selector).each(function(){
		var i, j;
		i = pos % width;
		j = Math.floor(pos / height);
		$(this).css('background-color', ((data[j][i] == '0') ? 'white' : 'black'));
		pos++;
	});
}

function update() {
	var asdf = $('#asdf');
	$.getJSON('/all', function (data) {
		var arr = [];
		for (var user in data) {
			arr.push(data[user]);
		}
		arr.sort(function (a, b) {
			return b.score - a.score;
		});
		asdf.html('');
		for (var i = 0; i < arr.length; i++) {
			var div = $('<div />');
			var tdiv = $('<div />');
			initRaster(tdiv);
			updateRaster(tdiv, arr[i].data);
			$(div).prepend('<p>' + user + " (" + arr[i].score + ")" + '</p>');
			div.append(tdiv);
			asdf.append(div);
		}
	});
	setTimeout(update, 1000);
}

$(document).ready(function () {
	update();
});
