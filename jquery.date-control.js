(function ($)
{
	$.fn.dateControl = function ()
	{
		var $input = $(this);
		if ($input.data('init')) {
			return this;
		}
		$input.data('init', true);
		var $this = $input.parent(),
				$dates = $this.find('.date-control_dates_data'),
				$datesScroll = $this.find('.date-control_dates_scroll'),

				$monthScroll = $this.find('.date-control_months_scroll'),
				$monthScrollSweep = $this.find('.date-control_months_scroll_sweep'),
				$monthPlane = $this.find('.date-control_month_plane'),

				$yearScroll = $this.find('.date-control_years_scroll'),
				$yearScrollSweep = $this.find('.date-control_years_scroll_sweep'),
				$yearPlane = $this.find('.date-control_year_plane'),

				now = new Date(),
				year = now.getFullYear(),
				date,
				days,
				startWeek,
				i, j,
				monthsArr = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь',
				             'ноябрь', 'декабрь'],
				yearsArr = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
				setterYear,
				dayCount,
				getDaysInMonth = (function ()
				{
					var months = {r: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
							l          : [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]},
						isLeapYear = function (year)
						{
							return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
						};
					return function (month, year)
					{
						return months[isLeapYear(year) ? 'l' : 'r'][month];
					}
				})(),
				updateCalendars = function (year)
				{
					var text = '',
						parseDate;
					if (year != setterYear) {
						setterYear = year;
						for (i = 1; i <= 12; i += 1) {
	//							parseDate = year + '\\' + (i < 10 ? '0' + i : i) + '\\01';
							date = new Date(year, i - 1, 1);
	//							alert(parseDate);
	//							alert(date);
	//							console.log(date);
							startWeek = date.getDay() || 7;
	//							alert(date.getDay());
	//							break;
	//							console.log('startWeek: ' + startWeek);
							dayCount = getDaysInMonth(i - 1, year);
	//							console.log('dayCount: ' + dayCount);
							text +=
								'<div class="date-control_month"><div class="date-control_month_label' + (startWeek > 3 ? ' date-control_month_label_drop-down' : '') + '">' + monthsArr[i - 1] + '</div><table class="date-control_dates_data_table"><tr>';
							days = 1;
							for (j = 1; j < startWeek; j += 1) {
								text += '<td class="date-control_empty"></td>';
							}
							for (j = startWeek; j <= 7; j += 1, days += 1) {
								text += '<td class="date-control_date' + (j > 5 ? ' date-control_holiday' : '') + '">' + days + '</td>';
							}
							text += '</tr><tr>';
							for (j = 1; days <= dayCount; days += 1, j += 1) {
								text +=
									'<td class="date-control_date' + (!(j % 7) || !((j + 1) % 7) ? ' date-control_holiday' : '') + '">' + days + '</td>';
								if (j % 7 == 0) {
									text += '</tr><tr>';
								}
							}
							text += '</tr></table></div>';
							//			break;
						}
						$dates.html(text);
						$dates.data('height', $dates.outerHeight() - $datesScroll.data('height') + 10); // i don't know where is this 10px
					}
				},
				isDatesScroll = false,
				isMonthsScroll = false;

		$monthPlane.data('height', $monthPlane.height());
		$monthScroll.data('height', $monthScroll.height() - $monthPlane.height() - 2); // 2px for beautiful view
		$yearScroll.data('height', $yearScroll.height() - $yearPlane.height() - 2);
		$datesScroll.data('height', $datesScroll.height());
//		console.log($monthScroll.data('height'));
		updateCalendars(year);
		var datesHeight = parseInt($dates.height() / 2, 10);
		$monthScrollSweep
			.css({'height': datesHeight + 'px'})
			.data('height', datesHeight - $monthScroll.height());
		$yearScrollSweep
			.css({'height': datesHeight + 'px'})
			.data('height', datesHeight - $yearScroll.height());
		$datesScroll.on('scroll', function ()
		{
			var datesScroll = $datesScroll.scrollTop(),
					datesHeight = $dates.data('height'),
					factor = datesScroll / datesHeight,
					monthsHeight = $monthScroll.data('height') * factor,
					scrollTop = $monthScrollSweep.data('height') * factor;
	//			console.log(datesScroll + '/' + datesHeight + ' = ' + factor);
	//			console.log(factor);
			$monthPlane.css({'top': parseInt(monthsHeight, 10) + 'px'});
			if (!isMonthsScroll) {
				isDatesScroll = true;
				$monthScroll.scrollTop(scrollTop);
			}
			else {
				isMonthsScroll = false;
			}
		});
		$monthScroll.on('scroll', function ()
		{
			if (!isDatesScroll) {
				isMonthsScroll = true;
				var monthsScroll = $monthScroll.scrollTop(),
						monthsHeight = $monthScrollSweep.data('height'),
						factor = Math.min(monthsScroll / monthsHeight, 1),
						scrollTop = $dates.data('height') * factor;
				$datesScroll.scrollTop(scrollTop);
//				console.log(factor);
			}
			else {
				isDatesScroll = false;
//				console.log('no scroll');
			}
//			console.log(monthsScroll + ' / ' + monthsHeight);
//			console.log(factor);
		})
			.on('mousedown', function (e)
			{
				e = e || window.event;
				var parentOffset = $(this).offset(),
						relY = e.pageY - parentOffset.top - ($monthPlane.height() / 2),
						factor = relY / ($monthScroll.data('height') + $monthPlane.height()),
						scrollTop = factor * ($dates.data('height') + $datesScroll.data('height'));
//				console.log(factor);
				$datesScroll.scrollTop(scrollTop);
			});
		$yearScroll.on('scroll', function ()
		{
			var yearsScroll = $yearScroll.scrollTop(),
					yearsHeight = $yearScrollSweep.data('height'),
					factor = yearsScroll / yearsHeight,
					height = $yearScroll.data('height') * factor,
					fullFactor = 1 / 11,
					halfFactor = fullFactor / 2,
					yearIndex = parseInt(((height / ($yearScroll.data('height'))) + halfFactor) / fullFactor, 10);
//			console.log(yearIndex);
			$yearPlane.css({'top': parseInt(height, 10) + 'px'});
			updateCalendars(yearsArr[yearIndex]);
		}).on('mousedown', function (e)
			{
				e = e || window.event;
				var parentOffset = $(this).offset(),
						relY = e.pageY - parentOffset.top - ($yearPlane.height() / 2),
						factor = relY / ($yearScroll.data('height')),
						scrollTop = factor * ($yearScrollSweep.data('height'));
//				console.log($yearScroll.data('height'));
				$yearScroll.scrollTop(scrollTop);
			});
//		console.log(text);
		return this;
	};
})(jQuery);