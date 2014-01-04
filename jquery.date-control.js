(function ($)
{
	var _template =
		'<div class="date-control">' +
			'<div class="date-control_wrap">' +
				'<table class="date-control_dates_data_table date-control_days-of-week">' +
					'<tr>' +
						'<td>П</td>' +
						'<td>В</td>' +
						'<td>С</td>' +
						'<td>Ч</td>' +
						'<td>П</td>' +
						'<td class="date-control_holiday">С</td>' +
						'<td class="date-control_holiday">В</td>' +
					'</tr>' +
				'</table>' +
				'<div class="date-control_dates">' +
					'<div class="date-control_dates_scroll">' +
						'<div class="date-control_dates_data"></div>' +
					'</div>' +
				'</div>' +
				'<div class="date-control_months">' +
					'<div class="date-control_plane date-control_month_plane"></div>' +
					'<ul class="date-control_months_list">' +
					'</ul>' +
					'<div class="date-control_months_scroll_wrap">' +
						'<div class="date-control_months_scroll">' +
							'<div class="date-control_months_scroll_sweep"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="date-control_years">' +
					'<div class="date-control_plane date-control_year_plane"></div>' +
					'<ul class="date-control_years_list">' +
					'</ul>' +
					'<div class="date-control_years_scroll_wrap">' +
						'<div class="date-control_years_scroll">' +
							'<div class="date-control_years_scroll_sweep"></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>';
	$.fn.dateControl = function (params)
	{
		params = params || {};
		var $input = $(this);
		$input.each(function ()
		{
			var $input = $(this);
			if ($input.data('init')) {
				return this;
			}
			$input.data('init', true);
			var input = this,
					$this = $(_template).insertAfter($input),
					value = input.value.split(' '),
					now = new Date(),
					i, j, max,
					monthsArr = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
					monthsArr2 = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
					monthsShortArr = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
					yearsArr = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
					$monthsList = $this.find('.date-control_months_list'),
					$yearsList = $this.find('.date-control_years_list'),
					isScrollInit = false;
			for (i = 0, max = monthsArr.length; i < max; i += 1) {
				$monthsList.append('<li>' + monthsArr[i] + '</li>')
			}
			for (i = 0, max = yearsArr.length; i < max; i += 1) {
				$yearsList.append('<li>' + yearsArr[i] + '</li>')
			}
			if (value.length == 3) {
				value[1] = monthsShortArr.indexOf(value[1].substr(0, 3));
			}
			else {
				value[0] = now.getDate();
				value[1] = now.getMonth();
				value[2] = now.getFullYear();
			}
			var $dates = $this.find('.date-control_dates_data'),
					$datesScroll = $this.find('.date-control_dates_scroll'),

					$monthScroll = $this.find('.date-control_months_scroll'),
					$monthScrollSweep = $this.find('.date-control_months_scroll_sweep'),
					$monthPlane = $this.find('.date-control_month_plane'),

					$yearScroll = $this.find('.date-control_years_scroll'),
					$yearScrollSweep = $this.find('.date-control_years_scroll_sweep'),
					$yearPlane = $this.find('.date-control_year_plane'),

					year = parseInt(value[2], 10),
					month = value[1],
					day = parseInt(value[0], 10),
					date,
					days,
					startWeek,
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
					scrollInit = function ()
					{
						isScrollInit = true;
						var fullFactor = 1 / 10,
								halfFactor = fullFactor / 2,
								factor = month * fullFactor - halfFactor,
								scrollTop = $monthScrollSweep.data('height') * factor;
						$monthScroll.scrollTop(scrollTop);
						fullFactor = 1 / 11;
						factor = yearsArr.indexOf(year) * fullFactor;
						scrollTop = $yearScrollSweep.data('height') * factor;
						$yearScroll.scrollTop(scrollTop);
					},
					updateCalendars = function (_year)
					{
						var text = '';
						setterYear = _year;
						for (i = 1; i <= 12; i += 1) {
							date = new Date(setterYear, i - 1, 1);
							startWeek = date.getDay() || 7;
							dayCount = getDaysInMonth(i - 1, setterYear);
							text +=
								'<div class="date-control_month" data-month="' + i + '"><div class="date-control_month_label' + (startWeek > 3 ? ' date-control_month_label_drop-down' : '') + '">' + monthsArr[i - 1] + '</div><table class="date-control_dates_data_table"><tr>';
							days = 1;
							for (j = 1; j < startWeek; j += 1) {
								text += '<td class="date-control_empty"></td>';
							}
							for (j = startWeek; j <= 7; j += 1, days += 1) {
								text += '<td class="date-control_date' + (j > 5 ? ' date-control_holiday' : '') + (i -1 == month && days == day ? ' date-control_select-day' : '') + '">' + days + '</td>';
							}
							text += '</tr><tr>';
							for (j = 1; days <= dayCount; days += 1, j += 1) {
								text +=
									'<td class="date-control_date' + (!(j % 7) || !((j + 1) % 7) ? ' date-control_holiday' : '') + (i -1 == month && days == day ? ' date-control_select-day' : '') + '">' + days + '</td>';
								if (j % 7 == 0) {
									text += '</tr><tr>';
								}
							}
							text += '</tr></table></div>';
						}
						$dates.html(text);
						$this.find('.date-control_date').on('click', function ()
						{
							var $that = $(this);
							day = parseInt($that.html(), 10);
							month = $that.closest('.date-control_month').data('month') - 1;
							var dateText = day + ' ' + monthsArr2[month] + ' ' + setterYear;
							input.value = dateText;
							$this.find('.date-control_date').removeClass('date-control_select-day').filter($that).addClass('date-control_select-day');
							if (typeof params.changeDate == 'function') {
								params.changeDate.call(input, year, month, day, dateText);
							}
						});
						$dates.data('height', $dates.height() - $datesScroll.data('height') + 10); // i don't know where is this 10px
						if ($dates.height() == 0) {
							var timer = setInterval(function ()
							{
								if ($dates.height() != 0) {
									clearInterval(timer);
									initHeight();
									if (!isScrollInit) {
										scrollInit();
									}
								}
							}, 100);
						}
						else {
							initHeight();
							if (!isScrollInit) {
								scrollInit();
							}
						}
					},
					isDatesScroll = false,
					isMonthsScroll = false,
					initHeight = function ()
					{
						$monthPlane.data('height', $monthPlane.height());
						$monthScroll.data('height', $monthScroll.height() - $monthPlane.height() - 2); // 2px for beautiful view
						$yearScroll.data('height', $yearScroll.height() - $yearPlane.height() - 2);
						$datesScroll.data('height', $datesScroll.height());
						$dates.data('height', $dates.height() - $datesScroll.data('height') + 10); // i don't know where is this 10px
						var datesHeight = parseInt($dates.height() / 2, 10);
						$monthScrollSweep
							.css({'height': datesHeight + 'px'})
							.data('height', datesHeight - $monthScroll.height());
						$yearScrollSweep
							.css({'height': datesHeight + 'px'})
							.data('height', datesHeight - $yearScroll.height());
					};
			updateCalendars(year);
			$datesScroll.on('scroll', function ()
			{
				var datesScroll = $datesScroll.scrollTop(),
						datesHeight = $dates.data('height'),
						factor = datesScroll / datesHeight,
						monthsHeight = $monthScroll.data('height') * factor,
						scrollTop = $monthScrollSweep.data('height') * factor;
				$monthPlane.css({'top': parseInt(monthsHeight, 10) + 'px'});
				if (!isMonthsScroll) {
					isDatesScroll = true;
					$monthScroll.scrollTop(scrollTop);
				}
				else {
					isMonthsScroll = false;
				}
			});
			$('body').on('mouseup', function ()
			{
				$monthScroll.data('moving', false);
				$yearScroll.data('moving', false);
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
				}
				else {
					isDatesScroll = false;
				}
			})
			.on('mousedown', function (e)
			{
				e = e || window.event;
				var parentOffset = $(this).offset(),
						relY = e.pageY - parentOffset.top - ($monthPlane.height() / 2),
						factor = relY / ($monthScroll.data('height') + $monthPlane.height()),
						scrollTop = factor * ($dates.data('height') + $datesScroll.data('height'));
				$datesScroll.scrollTop(scrollTop);
				$(this).data('moving', true);
			})
			.on('mousemove', function (e)
			{
				if ($(this).data('moving')) {
					e = e || window.event;
					var parentOffset = $(this).offset(),
						relY = e.pageY - parentOffset.top - ($monthPlane.height() / 2),
						factor = relY / ($monthScroll.data('height') + $monthPlane.height()),
						scrollTop = factor * ($dates.data('height') + $datesScroll.data('height'));
					$datesScroll.scrollTop(scrollTop);
				}
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
				$yearPlane.css({'top': parseInt(height, 10) + 'px'});
				if (yearsArr[yearIndex] != setterYear) {
					if (typeof params.changeYear == 'function') {
						params.changeYear.call(input, yearIndex);
					}
					year = yearsArr[yearIndex];
					updateCalendars(year);
					input.value = day + ' ' + monthsArr2[month] + ' ' + year;
				}
			})
			.on('mousedown', function (e)
			{
				e = e || window.event;
				var parentOffset = $(this).offset(),
						relY = e.pageY - parentOffset.top - ($yearPlane.height() / 2),
						factor = relY / ($yearScroll.data('height')),
						scrollTop = factor * ($yearScrollSweep.data('height'));
				$yearScroll.scrollTop(scrollTop);
				$(this).data('moving', true);
			})
			.on('mousemove', function (e)
			{
				if ($(this).data('moving')) {
					e = e || window.event;
					var parentOffset = $(this).offset(),
							relY = e.pageY - parentOffset.top - ($yearPlane.height() / 2),
							factor = relY / ($yearScroll.data('height')),
							scrollTop = factor * ($yearScrollSweep.data('height'));
					$yearScroll.scrollTop(scrollTop);
				}
			});
			return this;
		});
	};
})(jQuery);