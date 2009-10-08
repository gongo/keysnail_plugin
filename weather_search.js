/**
 * @fileOverview * * * 
 * @name weather_search.js * * * 
 * @description * * * 
 * @author gongo <gonngo@gmail.com> * * * 
 * @license The MIT License * * * 
 */

/**
 * Usage * * * 
 * * * * 
 * Paste this code to your keysnail.js file. * * * 
 * * * * 
 * Press 'C-2' key (or your defined one) to start this client. * * * 
 * * * * 
 * When the key is pushed on the site to be shortened, * * * 
 * the title of the page and shortened URL are displayed with popup. * * * 
 */

key.setGlobalKey('C-3', function (ev, arg) {
    var listener = {
      observe : function(subject, topic, data) {
	  if (topic == "alertclickcallback") {
	      gBrowser.loadOneTab(data, null, null, null, false);
	  }
	  if (!unPopUppedStatuses || !unPopUppedStatuses.length) {
	      return;
	  }
      }
    };

    var city_list = [
	["那覇", "136"],
	["名護", "137"],
	["久米島", "138"]
	];

    function createHttpRequest() {
	if (window.ActiveXObject) {
	    try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	    } catch(e) {
		try {
		    return new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e2) {
		    return null;
		}
	    }
	} else if (window.XMLHttpRequest) {
	    return new XMLHttpRequest;
	} else {
	    return null;
	}
    }

    function getCityList() {
	var xhr = new XMLHttpRequest;

	xhr.open("GET", "http://weather.livedoor.com/forecast/rss/forecastmap.xml", false);
	xhr.send("");
	var str = "";
	
	var xml = xhr.responseXML;
	var areas = xml.getElementsByTagName("area");

	for (var i = 0; i < areas.length; i++) {
	    var prefs = areas[i].getElementsByTagName("pref");
	    for (var j = 0; j < prefs.length; j++) {
	        var cities = prefs[j].getElementsByTagName("city");
	        for (var k = 0; k < cities.length; k++) {
		    alert(cities[k]);
	     //    str += cities[0].title;
		    return;
		}
	    }
	}
	
	return str;
    }

    alert(getCityList());
    
    prompt.selector({
      message: "Select Translation",
      collection: city_list,
      callback: function (city) {
	  prompt.read("String: ", function(input, city_idx) {
	      var city_id = city_list[city_idx][1];
	      var city_name = city_list[city_idx][0];
	      var day = "today";
	      var target = "http://weather.livedoor.com/forecast/webservice/rest/v1?"
		+ "city=" + city_id + "&day=" + day;

	      var xhr = createHttpRequest();
	      var alertsService = Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService);

	      xhr.onreadystatechange = function (aEvent) {
		  if (xhr.readyState == 4) {
		      if (xhr.status != 200) {
			  return;
		      }
		      var xml = xhr.responseXML;
		      var elm = xml.getElementsByTagName("image")[0];
		      var title = elm.getElementsByTagName("title")[0].firstChild.nodeValue;
		      var link  = elm.getElementsByTagName("link")[0].firstChild.nodeValue;
		      var image = elm.getElementsByTagName("url")[0].firstChild.nodeValue;
		      alertsService.showAlertNotification(image, city_name, title, true,
							  link, listener);
		  }
	      }

	      xhr.open("GET", target, true);
	      xhr.setRequestHeader("Content-Type", "text/xml");
	      xhr.send("");
	  }, city);
      }
    });
}, 'WeatherSearch');
