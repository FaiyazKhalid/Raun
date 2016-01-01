// TODO: sketch the architecture!
//       - keep in mind: landing page
// TODO: sitematrix for landing page
// TODO: target: modular filters.
// TODO: define all functions!
// TODO: rmb intuition messages, fetch from ./messages/XX.json
// TODO: fetch ns-XX localization using https://www.mediawiki.org/wiki/API:Allmessages
// TODO: sitematrix for landing page

var raunConfig = {
    "show": {
        "bot": false,
        "anon": true,
        "new": true,
        "minor": true,
        "redirect": true,
        "editor": true,
        "admin": true,
        "others": true
    },
    "tool": {
        "more_entries": true
    },
    "project": "wikipedia",
    "language": "id",
    "locale": "en"
};
var Helper = function() {
  return;
};
/**
urL: string, base url without param
param: object
success: callback function
*/
Helper.prototype.ajax = function (url, param, success) {
  $.ajax({
      type: "GET",
      url: url,
      data: param,
      dataType: "jsonp",
      success: success,
      error: function (xhr, ajaxOptions, thrownError) {
          console.error(xhr);
      }
  });
};
Helper.prototype.mwapi = function(param, success) {
  var url = "//" + raunConfig.language + "." + raunConfig.project + ".org/w/api.php";
  return this.ajax(url, param, success);
};


var Raun = function() {
  var helper = new Helper();
  this.rc = function() {
    helper.mwapi({
      format: "json",
      action: "query",
      list: "recentchanges",
      rctype: "edit|new",
      rcprop: "title|ids|sizes|flags|user|userid|comment|parsedcomment|timestamp|redirect|loginfo|tags",
      rclimit: 500
    }, function (data) {
      console.log(data);
    });
  };
};
var raun = new Raun();
raun.rc();
