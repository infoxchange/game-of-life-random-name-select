var width, height;
function initRaster(selector) {
	width = 100;
	height = 100;

	table = '<table><tbody>';

	for (var j = 0; j < height; j++)
		table += '<tr>'; 
		for (var i = 0; i < width; i++)
		{
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
		
	});
}
