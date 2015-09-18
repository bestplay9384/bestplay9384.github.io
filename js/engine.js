$(function() {
		
		function getUrlParameter(sParam) {
			var sPageURL = decodeURIComponent(window.location.search.substring(1)),
				sURLVariables = sPageURL.split('&'),
				sParameterName,
				i;

			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');

				if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : sParameterName[1];
				}
			}
		};
	
		function getTimeStamp(datetime) {
			var split = datetime.split(' ');
			var date = split[0];
			var time = split[1];
			var y,m,d,h,i,s,ms;
			var parseDate = date.split('-');
			y = parseInt(parseDate[0]);
			m = parseInt(parseDate[1]);
			d = parseInt(parseDate[2]);
			var parseTime = time.split(':');
			h = parseInt(parseTime[0]);
			i = parseInt(parseTime[1]);
			var ms1 = parseTime[2].split('.');
			if(ms1.length > 1) {
				s = parseInt(ms1[0]);
				ms = parseInt(ms1[1]);
			} else {
				s = parseInt(parseTime[2]);
				ms = 0;
			}
			
			return new Date(y, m, d, h, i, s, ms).getTime();
		}
		
		function twoDigits(value) {
		   return (value < 10) ? '0' + value : value;
		}
		
		function getDateFromTimestamp(timestamp) {
		  var a = new Date(timestamp);
		  var year = a.getFullYear();
		  var month = twoDigits(a.getMonth()+1);
		  var day = twoDigits(a.getDate());
		  var hour = twoDigits(a.getHours());
		  var min = twoDigits(a.getMinutes());
		  var sec = twoDigits(a.getSeconds());
		  var msec = twoDigits(a.getMilliseconds());
		  var fullDate = (year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec + '.' + msec);
		  return fullDate;
		}
		
		function addDataFromFile(file, labelText, os) {
			$.ajax({
				type: "GET",
				url: file,
				dataType: "text",
				async: false,
				success: function(x) {
					var linesArray = x.split("\n");
					if(linesArray.length > 0 ) {
						var charPoints = [];
						for (var i = 0; i <= linesArray.length-1; i++) {
							var rowData = linesArray[i].split(";");
							charPoints.push([getTimeStamp(rowData[0]), parseFloat(rowData[1])]);
						}
						dane.push({ label: labelText, yaxis: parseInt(os), data: charPoints });
					}
				}
			});
		}
		
		function loadFiles() {
			var getParam = getUrlParameter("files");
			var urlFiles = getParam.split(';');
			if(urlFiles.length > 1) {
				for(var i=0; i<urlFiles.length; i++) {
					var filePath = urlFiles[i].split(':')[0];
					var fileLabel = urlFiles[i].split(':')[1];
					var fileAxis = urlFiles[i].split(':')[2];
					addDataFromFile(filePath, fileLabel, fileAxis);
				}
			} else {
				addDataFromFile(getParam.split(':')[0], getParam.split(':')[1], getParam.split(':')[2]);
			}
		}
		
		function percentFormatter(v, axis) {
			return v.toFixed(axis.tickDecimals) + "%";
		}
		
		var dane = new Array();
		var options = {
			legend: {
				show: true,
				position: "sw",
				backgroundColor: "red",
				backgroundOpacity: 0.2,
				noColumns: 0
			},
			series: {
				lines: {
					show: true
				},
				points: {
					show: true
				}
			},
			grid: {
				hoverable: true,
				clickable: true
			},
			xaxes: [{
				mode: "time",
				minTickSize: [1, "second"],
				timeformat: "%Y-%m-%d %H:%M:%S"
			}],
			yaxes: [
				{ position: 'left', tickFormatter: percentFormatter },
				{ position: 'left' }
			],
			zoom: {
				interactive: true
			},
			pan: {
				interactive: true
			}
		};
		
		loadFiles();
		//alert(JSON.stringify(dane, null, '\t'));
		var plot = $.plot("#placeholder", dane, options);

		$("#placeholder").bind("plothover", function (event, pos, item) {
				if (item) {
					var x = getDateFromTimestamp(item.datapoint[0]);
					var y = item.datapoint[1];
					$(".tooltip").html("<b style='color: orange'>" + x + "</b>, <b style='color: green'>" + y + "</b>")
						.css({top: item.pageY+5, left: item.pageX+5})
						.fadeIn(200);
				} else {
					$(".tooltip").hide();
				}
		});
		
				$.each(plot.getAxes(), function (i, axis) {
					if (!axis.show)
						return;

					var box = axis.box;

					$("<div class='axisTarget' style='position:absolute; left:" + box.left + "px; top:" + box.top + "px; width:" + box.width +  "px; height:" + box.height + "px'></div>")
						.data("axis.direction", axis.direction)
						.data("axis.n", axis.n)
						.css({ backgroundColor: "#f00", opacity: 0, cursor: "pointer" })
						.appendTo(plot.getPlaceholder())
						.hover(
							function () { 
								if(axis.direction == "y") {
									$(this).css({ opacity: 0.2 });
									var result = $.grep(dane, function(e){ return e.yaxis == axis.n });
									var texts = [];
									$.each(result, function(index, value) { 
										texts.push(value.label); 
									});
									$(".legendLabel").each(function() {
										if($.inArray($(this).text(), texts) !== -1) {
											$(this).css('font-weight','bold').css('text-decoration','underline');
										}
									});
								}
							},
							function () { 
								if(axis.direction == "y") {
									$(this).css({ opacity: 0 });
									var result = $.grep(dane, function(e){ return e.yaxis == axis.n });
									var texts = [];
									$.each(result, function(index, value) { texts.push(value.label) });
									$(".legendLabel").each(function() {
										if($.inArray($(this).text(), texts) !== -1) {
											$(this).css('font-weight','normal').css('text-decoration','none');
										}
									});
								}
							}
						);
				});
		
});