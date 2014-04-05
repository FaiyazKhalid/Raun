last_rcid = 0;
gtz = 0;
config = {
	show_bot: false,
	show_anon: true,
	show_new: true,
	show_minor:true,
	show_redirect:true,
	show_editor:true,
	show_admin:true,
	show_others:true,
	pause: false,
	timeout: 10000,
	project: "wikipedia",
	language: "id",
	locale: "en"
};
user_group = new Array();
start_notif = false;

$(document).ready(function () {
	//Twitter Bootstrap keep-open class
	//source: http://stackoverflow.com/questions/11617048/twitter-bootstrap-stop-just-one-dropdown-toggle-from-closing-on-click
	$('.dropdown-menu').click(function(event){
		if($(this).hasClass('keep-open')){
			event.stopPropagation();
		}
	});
	//End Twitter Bootstrap keep-open class
	
	function formatnum(nStr)
	// http://www.mredkj.com/javascript/numberFormat.html
	{
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? locale_obj['separator_decimals'] + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + locale_obj['separator_thousands'] + '$2');
		}
		return x1 + x2;
	}

	//Create, Read, Erase Cookie
	//source: http://www.quirksmode.org/js/cookies.html
	function createCookie(name, value, days) {
		var expires;
	
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
	}
	
	function readCookie(name) {
		var nameEQ = escape(name) + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
		}
		return null;
	}
	
	function eraseCookie(name) {
		createCookie(name, "", -1);
	}
	//End Create, Read, Erase Cookie
	
	// Date-time function
	//source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
	function pad(number) {
		if ( number < 10 ) {
			return '0' + number;
		}
		return number;
	}
	
	function get_time() {
		var date = new Date();
		date.setDate(date.getDate() - 1);
		return ( date.getUTCFullYear() ) +
		'-' + pad( date.getUTCMonth() + 1 ) +
		'-' + pad( date.getUTCDate() ) +
		'T' + pad( date.getUTCHours() ) +
		':' + pad( date.getUTCMinutes() ) +
		':' + pad( date.getUTCSeconds() ) +
		'Z';
	}
	
	function iso_str() {
		var date = new Date();
		return date.getUTCFullYear() +
		'-' + pad( date.getUTCMonth() + 1 ) +
		'-' + pad( date.getUTCDate() ) +
		' ' + pad( date.getUTCHours() ) +
		':' + pad( date.getUTCMinutes() ) +
		':' + pad( date.getUTCSeconds() ) +
		' UTC';
	}
	//End Date-time function
	
	
	// Clock
	function timer() {
		$("#tz").html(iso_str());
		setTimeout(function () { timer() }, 1000);
	}
	// End Clock
	
	$("#pause").click(function () {
		if (config['pause']) {
			config['pause'] = false;
			update(gtz);
			$("#pause").html("<span class=\"glyphicon glyphicon-pause\"></span> Pause");
		} else {
			config['pause'] = true;	
			$("#pause").html("<span class=\"glyphicon glyphicon-play\"></span> Jalan!");
		}
	});
	
	
	$(document).on( "click", ".ns", function(){
		$('#help').modal('show');
	});
	function update_tool_config() {
		createCookie("locale", $("#locale").val(), 30);
		createCookie("language", $("#language").val(), 30);
		createCookie("project", $("#project").val(), 30);
		
		config["language"] = $("#language").val();
		config["project"] = $("#project").val();
		config["locale"] = $("#locale").val();
	}
	function update_config() {
		
		createCookie("show_bot", $("#show_bot").prop( "checked" ), 30);
		createCookie("show_anon", $("#show_anon").prop( "checked" ), 30);
		createCookie("show_new", $("#show_new").prop( "checked" ), 30);
		createCookie("show_minor", $("#show_minor").prop( "checked" ), 30);	
		createCookie("show_redirect", $("#show_redirect").prop( "checked" ), 30);	
		createCookie("show_editor", $("#show_editor").prop( "checked" ), 30);	
		createCookie("show_admin", $("#show_admin").prop( "checked" ), 30);		
		createCookie("show_others", $("#show_others").prop( "checked" ), 30);	
		
		
		
		config["show_bot"] = $("#show_bot").prop( "checked" );
		config["show_anon"] = $("#show_anon").prop( "checked" );
		config["show_new"] = $("#show_new").prop( "checked" );
		config["show_minor"] = $("#show_minor").prop( "checked" );
		config["show_redirect"] = $("#show_redirect").prop( "checked" );
		config["show_editor"] = $("#show_editor").prop( "checked" );
		config["show_admin"] = $("#show_admin").prop( "checked" );
		config["show_others"] = $("#show_others").prop( "checked" );
		update_tool_config();
		
	}
	
	$(".config").change(function () {
		
		new_config = {
			show_bot: $("#show_bot").prop( "checked" ),
			show_anon: $("#show_anon").prop( "checked" ),
			show_new: $("#show_new").prop( "checked" ),
			show_minor:$("#show_minor").prop( "checked" ),
			show_redirect:$("#show_redirect").prop( "checked" ),
			show_editor: $("#show_editor").prop( "checked" ),
			show_admin:$("#show_admin").prop( "checked" ),
			show_others:$("#show_others").prop( "checked" )
			
		}
		
		if (new_config['show_bot'] && !config['show_bot']) sD(".bot");
		if (new_config['show_anon'] && !config['show_anon']) sD(".anon");
		if (new_config['show_new'] && !config['show_new']) sD(".new-art");
		if (new_config['show_minor'] && !config['show_minor']) sD(".minor");
		if (new_config['show_redirect'] && !config['show_redirect']) sD(".redirect");
		if (new_config['show_editor'] && !config['show_editor']) sD(".editor");
		if (new_config['show_admin'] && !config['show_admin']) sD(".admin");
		if (new_config['show_others'] && !config['show_others']) sD(".others");
		
		if (!new_config['show_bot']) {
			sU(".bot");
		}
		if (!new_config['show_anon']) {
			sU(".anon");
		}
		if (!new_config['show_new']) {
			sU(".new-art");
		}
		if (!new_config['show_minor']) {
			sU(".minor");
		}
		if (!new_config['show_redirect']) {
			sU(".redirect");
		}
		if (!new_config['show_editor']) {
			sU(".editor");
		}
		if (!new_config['show_admin']) {
			sU(".admin");
		}
		if (!new_config['show_others']) {
			sU(".others");
		}
		
		update_config();
	});
	$("#tool_config").submit(function () {
		update_tool_config();
	});
	
	function sD(elem) {
		$(elem).show();
	}
	function sU(elem) {
		$(elem).hide();
	}
	function ns(i) {
		return locale_obj['ns' + i];
	}
	
	function user_list(group, after_func) {
		$("#w_stat").html(" <img src='img/loading.gif' style='width:16px; height:16px;'>");
		$.ajax({
			type: "POST",
			url: "api.php",
			data: {group: group},
			dataType: "json",
			success: function(data) {
				$("#w_stat").html();
				user_group[group] = new Array();
				for (var i=0; i<data.length; i++) {
					user_group[group][data[i]['name'].toLowerCase()] = true;
				}
				user_group[group][-1] = data;
				after_func();
			},
			error:function (xhr, ajaxOptions, thrownError){
				console.log(xhr.statusText);
			}
		});	
	}
	function displayStat(data) {
		msg = "";
		
		depth = data['edits'] * (data['pages'] - data['articles']) * (data['pages'] - data['articles']) / (data['articles'] * data['articles'] * data['pages']);
		
		msg += ""
		+ "<dl class=\"dl-horizontal\">"
		+ "<dt>"
		+ locale_obj['stat_articles']
		+ "</dt>"
		+ "<dd>"
		+ formatnum(data['articles'])
		+ "</dd>"
		
		+ "<dt>"
		+ locale_obj['stat_pages']
		+ "</dt>"
		+ "<dd>"
		+ formatnum(data['pages'])
		+ "</dd>"
		
		+ "<dt>"
		+ locale_obj['stat_files']
		+ "</dt>"
		+ "<dd>"
		+ formatnum(data['images'])
		+ "</dd>"
		
		+ "<dt>"
		+ locale_obj['stat_edits']
		+ "</dt>"
		+ "<dd>"
		+ formatnum(data['edits'])
		+ "</dd>"
		
		+ "<dt>"
		+ locale_obj['stat_depth']
		+ "</dt>"
		+ "<dd>"
		+ formatnum(parseFloat(depth).toFixed(4))
		+ "</dd>"
		
		+ "<dt>"
		+ locale_obj['stat_users']
		+ "</dt>"
		+ "<dd>"
		+ formatnum(data['users'])
		+ "</dd>"
		
		+ "<dt>"
		+ locale_obj['stat_active_users']
		+ "</dt>"
		+ "<dd>"
		+ formatnum(data['activeusers'])
		+ "</dd>"
		
		+ "<dt>"
		+ locale_obj['stat_admins']
		+ "</dt>"
		+ "<dd>"
		+ formatnum(data['admins'])
		+ "</dd>"
		
		+ "</dl>";
		
		$("#w_stat").html(msg);
	}
	function updateStat() {
		$.ajax({
			type: "POST",
			url: "api.php",
			data: {statistics: true,
				project: config['project'],
				language: config['language']
			},
			dataType: "json",
			success: function(data) {
				displayStat(data);
			},
			error:function (xhr, ajaxOptions, thrownError){
				console.log(xhr.statusText);
				$("#stat").html(" " + xhr.statusText);
			}
		});
	}
	function displayMsg(data) {
		len = data.length;
		tz = gtz;
		for (i = len-1; i>=0; i--) {
			if (i <= 5) start_notif = true;
			if (last_rcid >= data[i]['rcid']) {
				continue;
			} else {
				last_rcid = data[i]['rcid'];
			}
			diff = (data[i]['newlen']-data[i]['oldlen']);
			s_diff = diff > 0 ? "+" + diff : diff;
			tz = data[i]['timestamp'];
			gtz = tz;
			time = new Date(tz);
			
			comment = data[i]['parsedcomment'].replace(/\"\/wiki\//g, "\"" + base_site + "wiki/" );
			
			attr = "";
			
			if ("anon" in data[i]) {
				attr += "anon ";
			}
			if ("bot" in data[i]) {
				attr += "bot ";
			}
			if ("minor" in data[i]) {
				attr += "minor ";
			}
			if ("redirect" in data[i]) {
				attr += "redirect ";
			}
			if (data[i]['type'] == 'new') {
				attr += "new-art ";
			}
			if (data[i]['user'].toLowerCase() in user_group['editor']) {
				attr += "editor ";
			}
			if (data[i]['user'].toLowerCase() in user_group['sysop']) {
				attr += "admin ";
			}
			if (attr === "") {
				attr = "others ";
			}
			attr += "revid-" + data[i]['revid'] + " ";
			$(".revid-" + data[i]['old_revid']).addClass("inactive");
			
			msg = "<tr id=\"row-" + data[i]['rcid'] + "\" class=\"" + attr + "\">"
				
				+ "<td "
				+ "title=\""
				+ locale_obj['ns']
				+ ": "
				+ ns(data[i]['ns'])
				+ "\" "
				+ "class=\"ns ns-"
				+ data[i]['ns']
				+ "\">"
				+ "</td>"
				
				+ "<td>"
				+ pad( time.getUTCHours() )
				+ ':' + pad( time.getUTCMinutes() )
				+ ':' + pad( time.getUTCSeconds() )
				+ "</td>"
				
				+ "<td>"
				+ "<a "
				
				+ "href=\""
				+ base_site
				+ "w/index.php?title="
				+ data[i]['title']
				+ "&diff="
				+ data[i]['revid']
				+ "&oldid="
				+ data[i]['old_revid']
				+ "\">"
				
				+ data[i]['title']
				
				+ "</a>"
				
				+ " <span style=\"white-space: nowrap;\">. .</span> ";
				
			msg += "<span class=\"";
			if (s_diff > 0) {
				msg += "size-pos";
			} else if (s_diff < 0) {
				msg += "size-neg";
			} else {
				msg += "size-null";
			}
			if (Math.abs(s_diff) > 500) {
				msg += " size-large";
			}
			msg += "\">";
				
			msg += "("
				+ s_diff
				+ ")";
				
			msg += "</span>";
			
			msg += "</td>"
				
				+ "<td>"
				+ "<a"
				+ " class=\""
				+ "username"
				+ "\""
				
				+ " href=\""
				+ base_site
				+ "wiki/Special:Contributions/"
				+ data[i]['user']
				+ "\">"
				
				+ data[i]['user']
				
				+ "</a>"
				+ "</td>"
				
				+ "<td>";
			if (data[i]['type'] == 'new') {
				msg += "<span class=\"label label-success\" title=\"" + locale_obj['settings_new_pages'] + "\">" + locale_obj['new'] + "</span> ";
			}
			if ("minor" in data[i]) {
				msg += "<span class=\"label label-primary\" title=\"" + locale_obj['settings_minor_edits'] + "\">" + locale_obj['minor'] + "</span> ";
			}
			if ("anon" in data[i]) {
				msg += "<span class=\"label label-danger\" title=\"" + locale_obj['settings_anon_edits'] + "\">" + locale_obj['anon'] + "</span> ";
			}
			if ("redirect" in data[i]) {
				msg += "<span class=\"label label-warning\" title=\"" + locale_obj['settings_redirects'] + "\">" + locale_obj['redirect'] + "</span> ";
			}
			if ("bot" in data[i]) {
				msg += "<span class=\"label label-info\" title=\"" + locale_obj['settings_bot_edits'] + "\">" + locale_obj['bot'] + "</span> ";
			}
			if (data[i]['user'].toLowerCase() in user_group['editor']) {
				msg += "<span class=\"label label-default\" title=\"" + locale_obj['settings_editor_edits'] + "\">" + locale_obj['editor'] + "</span> ";
			}
			if (data[i]['user'].toLowerCase() in user_group['sysop']) {
				msg += "<span class=\"label label-info\" title=\"" + locale_obj['settings_admin_edits'] + "\">" + locale_obj['admin'] + "</span> ";
			}
			
			msg += comment;
			
			if (data[i]['tags'] != "") {
			msg += 
				 " (Tag: <i>"
				+ data[i]['tags']
				+ "</i>)"
			}
			msg += 
				 "</td>"
				+ "</tr>\n";
			
												
			$("#main-table-body").prepend(msg);
			$('#main-table > tbody > tr#row-' + data[i]['rcid']).hide();
			$('#main-table > tbody > tr#row-' + data[i]['rcid']).addClass("new-entry");
			
			show_art = true;
			if (attr.indexOf("bot") >= 0) {
				if (!config['show_bot']) {
					show_art = false;	
				}
			}
			if (attr.indexOf("minor") >= 0) {
				if (!config['show_minor']) {
					show_art = false;
				}
			}
			if (attr.indexOf("redirect") >= 0) {
				if (!config['show_redirect']) {
					show_art = false;
				}
			}
			if (attr.indexOf("new-art") >= 0) {
				if (!config['show_new']) {
					show_art = false;	
				}
			}
			if (attr.indexOf("anon") >= 0) {
				if (!config['show_anon']) {
					show_art = false;	
				}
			}
			if (attr.indexOf("admin") >= 0) {
				if (!config['show_admin']) {
					show_art = false;	
				}
			}
			if (attr.indexOf("editor") >= 0) {
				if (!config['show_editor']) {
					show_art = false;	
				}
			}
			if (attr.indexOf("others") >= 0) {
				if (!config['show_others']) {
					show_art = false;	
				}
			}
			
			if (show_art === true) {
				sD('#main-table > tbody > tr#row-' + data[i]['rcid']);
				//console.log(start_notif);
				
				if (start_notif) {
					var notif_title = "";
					notif_title = "";
					notif_title +=
					"[Raun] " 
					+ data[i]['title']
					+ " ("
					+ s_diff
					+ ")";
					
					var notif_msg = "";
					notif_msg +=
						""
						+ pad( time.getUTCHours() )
						+ ':' + pad( time.getUTCMinutes() )
						+ ':' + pad( time.getUTCSeconds() )
						+ "\t"
						+ data[i]['title']
						+ " . . "
						+ "("
						+ s_diff
						+ ")"
						+ "\n"
						+ data[i]['user']
						+ "\n"
						+ data[i]['comment']
					if (data[i]['tags'] != "") {
					notif_msg +=
						" (Tag: "
						+ data[i]['tags']
						+ ")";
					}
					notif_show(notif_title, notif_msg);
				}
			}
			
			
		}
		setTimeout(function () {
			$(".new-entry").removeClass("new-entry");
		}, 1000);
		
	}
	function update(tz) {
		
		if (config['pause']) return false;
		gtz = tz;
		$("#stat").html(" <img src='img/loading.gif' style='width:16px; height:16px;'>");
		
		//if (false) {
		if (!!window.EventSource) {	
			update_tool_config();
		
			createCookie("rcfrom", gtz, 1);
			var source = new EventSource('api-sse.php');
			
			source.addEventListener('message', function(e) {
				if (config['pause']) return false;
				var data_obj = $.parseJSON(e.data);
				//console.log("Got message");
				//console.log(data_obj);
				displayMsg(data_obj);
				start_notif = true;
				
			}, false);
			source.addEventListener('statistics', function(e) {
				$("#stat").html("");
				var data_obj = $.parseJSON(e.data);
				//console.log("Got stat!");
				displayStat(data_obj);
			}, false);
			
			source.addEventListener('open', function(e) {
				// Connection was opened.
				createCookie("rcfrom", gtz, 1);
				//console.log("Connection opened");
			}, false);
			
			source.addEventListener('error', function(e) {
				//console.log("Connection error");
				console.log(e);
			}, false);
		} else {
			updateStat();
			
			// Result to xhr polling :(
			$.ajax({
				type: "POST",
				url: "api.php",
				data: {
					from: tz,
					project: config['project'],
					language: config['language']
				},
				dataType: "json",
				success: function(data) {
					//console.log(data);
					$("#stat").html("");
					if (data.length == 0) {
						setTimeout(function () { update(tz); }, 10000);
					} else {
						displayMsg(data);
						setTimeout(function () { update(tz); }, config['timeout']);
					}
				},
				error:function (xhr, ajaxOptions, thrownError){
					console.log(xhr.statusText);
					$("#stat").html(" " + xhr.statusText);
					setTimeout(function () { update(tz); }, 3000);
				}
			});
		}
		
	}
	// Web Notification
	// tested in Firefox 28 Beta and Chrome 33
	// 
	// https://developer.mozilla.org/en-US/docs/WebAPI/Using_Web_Notifications#Browser_compatibility
	// WORKAROUND FOR CHROME: ADD A BUTTON TO TRIGGER NOTIF_PERMISSION
	// for now, let's bind it to p.lead click
	$("p.lead").click(function () { notif_permission(); });
	function notif_permission (callback) {
		if (Notification && Notification.permission !== "granted") {
			Notification.requestPermission(function (status) {
				if (Notification.permission !== status) {
					Notification.permission = status;
				}
			});
		}
		if(callback) callback();
	}
	function notif_show(title, message) {
		//console.log(title);
		//console.log(message);
		
		var ttl = title;
		var msg = message;
		if (Notification && Notification.permission === "granted") {
		  var n = new Notification(title, {body: msg, tag: "Raun"});
		} else if (Notification && Notification.permission !== "denied") {
      		Notification.requestPermission(function (status) {
				if (Notification.permission !== status) {
				  Notification.permission = status;
				}
				var n = new Notification(title, {body: msg, tag: "Raun"});
      		});
		}
	}
	// Page Visibility API
	// https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
	// I think that no need for using this yet
	var hidden, visibilityChange; 
	if (typeof document.hidden !== "undefined") {
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}
	function handleVisibilityChange() {
		if (document[hidden]) {
			start_notif = true;
		} else {
			start_notif = false;
		}
	}
	//document.addEventListener(visibilityChange, handleVisibilityChange, false);
	
	function init() {
		if (readCookie("show_bot") == null) {
			$("#show_bot").prop( "checked", false );
			$("#show_anon").prop( "checked", true );
			$("#show_new").prop( "checked", true );
			$("#show_minor").prop( "checked", true );
			$("#show_redirect").prop( "checked", true );
			$("#show_editor").prop( "checked", true );
			$("#show_admin").prop( "checked", true );
			$("#show_others").prop( "checked", true );
			$("#language").val("id");
			$("#project").val("wikipedia");
			$("#locale").val("en");
			
			
			createCookie("show_bot", $("#show_bot").prop( "checked" ), 30);
			createCookie("show_anon", $("#show_anon").prop( "checked" ), 30);
			createCookie("show_new", $("#show_new").prop( "checked" ), 30);
			createCookie("show_minor", $("#show_minor").prop( "checked" ), 30);
			createCookie("show_redirect", $("#show_redirect").prop( "checked" ), 30);
			createCookie("show_editor", $("#show_editor").prop( "checked" ), 30);
			createCookie("show_admin", $("#show_admin").prop( "checked" ), 30);
			createCookie("show_others", $("#show_others").prop( "checked" ), 30);
			createCookie("language", $("#language").val(), 30);
			createCookie("project", $("#project").val(), 30);
			createCookie("locale", $("#locale").val(), 30);
		} else {
			$("#show_bot").prop( "checked", readCookie("show_bot") == 'true' );
			$("#show_anon").prop( "checked", readCookie("show_anon") == 'true' );
			$("#show_new").prop( "checked", readCookie("show_new") == 'true' );
			$("#show_minor").prop( "checked", readCookie("show_minor") == 'true' );
			$("#show_redirect").prop( "checked", readCookie("show_redirect") == 'true' );
			$("#show_editor").prop( "checked", readCookie("show_editor") == 'true' );
			$("#show_admin").prop( "checked", readCookie("show_admin") == 'true' );
			$("#show_others").prop( "checked", readCookie("show_others") == 'true' );
			if (force['language'] === false) {
				$("#language").val( readCookie("language") );
			}
			if (force['project'] === false) {
				$("#project").val( readCookie("project") );
			}
			if (force['locale'] === false) {
				$("#locale").val( readCookie("locale") );
			}
		}
		config = {
				show_bot: $("#show_bot").prop( "checked" ),
				show_anon: $("#show_anon").prop( "checked" ),
				show_new: $("#show_new").prop( "checked" ),
				show_minor:$("#show_minor").prop( "checked" ),
				show_redirect:$("#show_redirect").prop( "checked" ),
				show_editor:$("#show_editor").prop( "checked" ),
				show_admin:$("#show_admin").prop( "checked" ),
				show_others:$("#show_others").prop( "checked" ),
				pause: false,
				timeout: 10000,
				project: $("#project").val(),
				language: $("#language").val(),
				locale: $("#locale").val()
			}
		base_site = "http://" + config['language'] + "." + config['project'] + ".org/";
		timer();
		user_list('editor', function () { user_list('sysop', function () { update(get_time() ); }); });
		notif_permission();
	}
	
	init();
	
});