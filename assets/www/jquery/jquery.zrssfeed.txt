/**
 * Plugin: jquery.zRSSFeed
 * 
 * Version: 1.1.6 (c) Copyright 2010-2012, Zazar Ltd
 * 
 * Description: jQuery plugin for display of RSS feeds via Google Feed API
 * (Based on original plugin jGFeed by jQuery HowTo. Filesize function by Cary
 * Dunn.)
 * 
 * History: 1.1.6 - Added sort options 1.1.5 - Target option now applies to all
 * feed links 1.1.4 - Added option to hide media and now compressed with Google
 * Closure 1.1.3 - Check for valid published date 1.1.2 - Added user callback
 * function due to issue with ajaxStop after jQuery 1.4.2 1.1.1 - Correction to
 * null xml entries and support for media with jQuery < 1.5 1.1.0 - Added
 * support for media in enclosure tags 1.0.3 - Added feed link target 1.0.2 -
 * Fixed issue with GET parameters (Seb Dangerfield) and SSL option 1.0.1 -
 * Corrected issue with multiple instances
 * 
 */

(function($) {
	$.fn.rssfeed = function(url, options, fn) {
		// Set pluign defaults
		var defaults = {
			limit : 20,
			header : false,
			titletag : 'h4',
			date : true,
			content : true,
			snippet : true,
			media : false,
			showerror : true,
			errormsg : 'æŠ±æ­‰ï¼Œä¿¡æ¯åŠ è½½å¤±è´¥ï¼',
			key : null,
			ssl : false,
			linktarget : '_self',
			sort : '',
			sortasc : true
		};
		var options = $.extend(defaults, options);
		// Functions
		return this.each(function(i, e) {
			var $e = $(e);
			var s = '';

			// Check for valid url
			if (url == null)
				return false;
			// Create Google Feed API address
			var api = "http" + s + "://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + encodeURIComponent(url);
			if (options.limit != null)
				api += "&num=" + options.limit;
			if (options.key != null)
				api += "&key=" + options.key;
			api += "&output=json_xml"
			// Send request
			$.getJSON(api, function(data) {
				// Check for error
				if (data.responseStatus == 200) {
					// Process the feeds
					$('#newsListPageContent').show();
					$("#errorMsg").hide();
					_process(e, data.responseData, options);
					// Optional user callback function
					if ($.isFunction(fn))
						fn.call(this, $e);
				} else {
					// Handle error if required
					$('#newsListPageContent').hide();
					$("#errorMsg").show();
					if (options.showerror)
						if (options.errormsg != '') {
							var msg = options.errormsg;
						} else {
							var msg = data.responseDetails;
						}
					;
					$(e).html('<div class="rssError"><p align="center">' + msg + '</p></div>');
					window.plugins.PGLoadingDialog.hide();
				}
				;
			});
		});
	};
	// Function to create HTML result
	var _process = function(e, data, options) {
		// Get JSON feed data
		var feeds = data.feed;
		if (!feeds) {
			return false;
		}
		var rowArray = [];

		// Add feeds
		var list = $('#newsListPageListView');
		$('#newsListPageListView').empty();
		for ( var i = 0; i < feeds.entries.length; i++) {
			rowArray[i] = [];
			// Get individual feed
			var entry = feeds.entries[i];
			var pubDate;
			var sort = '';
			// Apply sort column
			switch (options.sort) {
			case 'title':
				sort = entry.title;
				break;
			case 'date':
				sort = entry.publishedDate;
				break;  
			}

			// Format published date
			if (entry.publishedDate) {
				var entryDate = new Date(entry.publishedDate);
				var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
			}
			var description=entry.content.replace(/<[^>]+>/g,"");
			$('#newsListPageListView').append(
					'<li data-icon="false"><a href="javascript:void(0)" my-data="' + entry.title + '#' + entry.link + '#' + entry.publishedDate + '#'
							+ description + '">' + entry.title + '</a></li>');

		}
		list.listview('refresh');
		window.plugins.PGLoadingDialog.hide();
	};

})(jQuery);