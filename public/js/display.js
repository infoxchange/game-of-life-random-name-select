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
		$(this).css('background-color', ((data[j][i] == '1') ? 'white' : 'black'));
		pos++;
	});
}