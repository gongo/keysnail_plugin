/**
 * @fileOverview
 * @name weather_search.js
 * @description Inform of weather information on the city in Japan
 * @author gongo <gonngo@gmail.com>
 * @license The MIT License
 */

/**
 * Usage
 *
 * Paste this code to your keysnail.js file.
 *
 * Press 'C-3' key (or your defined one) to start this client.
 *
 * First, select the city that you want to check of weather information
 *
 * The result of the weather information (weather kind and temperature celsius) is displayed by pop up.
 */

key.setGlobalKey('C-3', function (ev, arg) {
				   var city_list;
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

				   var actions = [
					 [function (index) {
						if (index >= 0) {
						  popupWeatherReport(index, "today");
						}
					  }, "Report for today"],
					 [function (index) {
						if (index >= 0) {
						  popupWeatherReport(index, "tomorrow");
						}
					  }, "Report for tomorrow"],
					 [function (index) {
						if (index >= 0) {
						  popupWeatherReport(index, "dayaftertomorrow");
						}
					  }, "Report for dayaftertomorrow"]
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
                     var data = [];

                     var xml = xhr.responseXML;
                     var areas = xml.getElementsByTagName("area");

                     for (var i = 0; i < areas.length; i++) {
                       var prefs = areas[i].getElementsByTagName("pref");
                       for (var j = 0; j < prefs.length; j++) {
                         var cities = prefs[j].getElementsByTagName("city");
                         for (var k = 0; k < cities.length; k++) {
                           var id = cities[k].attributes.getNamedItem("id").value;
                           var area = areas[i].attributes.getNamedItem("title").value;
                           var city = cities[k].attributes.getNamedItem("title").value;

                           data.push([city, area, id.toString()]);
                         }
                       }
                     }

                     return data;
                   }

				   function popupWeatherReport(index, day) {
                     var city_id = city_list[index][2];
                     var city_name = city_list[index][0];
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
						 var telop = xml.getElementsByTagName("telop")[0].firstChild.textContent;
						 var title = xml.getElementsByTagName("title")[0].firstChild.textContent;
                         var image = xml.getElementsByTagName("image")[0];
                         var link  = image.getElementsByTagName("link")[0].firstChild.nodeValue;
                         var imgurl = image.getElementsByTagName("url")[0].firstChild.nodeValue;

                         var temp = xml.getElementsByTagName("temperature")[0];
                         var max = temp.firstElementChild.children[0].textContent; // 摂氏
                         var min = temp.lastElementChild.children[0].textContent;
                         if (max == "") { max = "--"; }
                         if (min == "") { min = "--"; }

                         temp_str = "[最高/最低気温] : " + max + "/" + min;
						 
                         alertsService.showAlertNotification(imgurl, city_name, "[" + title + "] " + telop + "   " + temp_str,
                                                             true, link, listener);
                       }
                     };
                     xhr.open("GET", target, true);
                     xhr.setRequestHeader("Content-Type", "text/xml");
                     xhr.send("");
                   }

                   city_list = getCityList();

				   prompt.selector({message: "Select City",
                                    collection: city_list,
									flags: [0, 0, HIDDEN],
									header: ["City", "Area", ""],
									actions: actions});
				   
				 }, 'WeatherSearch');