var PLUGIN_INFO =
<KeySnailPlugin>
    <name>Weather Infomation Client on KeySnail</name>
    <name lang="ja">livedoor 天気情報 on KeySnail</name>
    <description>Weather Infomation that search from livedoor displayed</description>
    <description lang="ja">ライブ天気情報を Keysnail から取得する</description>
    <version>1.11</version>
    <updateURL>http://github.com/gongo/keysnail_plugin/blob/master/weather_search.ks.js</updateURL>
    <author mail="gonngo+github@gmail.com" homepage="http://d.hatena.ne.jp/gongoZ/">gongoZ</author>
    <license>The MIT License</license>
    <license lang="ja">MIT ライセンス</license>
    <minVersion>0.9.6</minVersion>
    <provides>
        <ext>weather-search</ext>
    </provides>
    <detail lang="ja"><![CDATA[
=== 使い方 ===
==== 起動 ====
M-x (または ext.select() を呼出すキーバインド) から wearch_search を選ぶと起動します。
次のようにして任意のキーへコマンドを割り当てておくことも可能です。
>||
key.setViewKey(["C-x", "C-c", "w"],
    function (ev, arg) {
        ext.exec("weather_search", arg);
    }, ext.description("weather_search"), true);
||<
例えば上記のような設定を初期化ファイル(.keysnail.jsなど)へ記述しておくことにより、ブラウズ画面で C-x C-c w と押すことで起動します。

==== アクションの選択 ====
起動すると、天気情報が取得できる都市一覧が表示されます。
この中から調べたい都市を選ぶと、ポップアップで今日の天気と気温が表示されます。
また、Ctrl + i キーを押すことにより、「今日」「明日」「明後日」の天気情報を選択できます。

]]></detail>
</KeySnailPlugin>;


function getCityList() {
  var xhr = new XMLHttpRequest;
  var url = "http://weather.livedoor.com/forecast/rss/forecastmap.xml";
  
  xhr.open("GET", url, false);
  xhr.send("");
  var data = new Array;
  
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
};

var cityList = getCityList();

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
   }, M({en: "Report for today", ja: "今日の天気"})],
  [function (index) {
	 if (index >= 0) {
	   popupWeatherReport(index, "tomorrow");
	 }
   }, M({en: "Report for tomorrow", ja: "明日の天気"})],
  [function (index) {
	 if (index >= 0) {
	   popupWeatherReport(index, "dayaftertomorrow");
	 }
   }, M({en: "Report for dayaftertomorrow", ja: "明後日の天気"})]
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

function popupWeatherReport(index, day) {
  var city_id = cityList[index][2];
  var city_name = cityList[index][0];
  var target = "http://weather.livedoor.com/forecast/webservice/rest/v1?"
    + "city=" + city_id + "&day=" + day;

  var xhr = createHttpRequest();
  var alertsService
	= Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService);

  xhr.onreadystatechange = function (aEvent) {
    if (xhr.readyState == 4) {
      if (xhr.status != 200) {
        return;
      }
      var xml = xhr.responseXML;
	  var telop
		= xml.getElementsByTagName("telop")[0].firstChild.textContent;
	  var title
		= xml.getElementsByTagName("title")[0].firstChild.textContent;
      var image = xml.getElementsByTagName("image")[0];
      var link  = image.getElementsByTagName("link")[0].firstChild.nodeValue;
      var imgurl = image.getElementsByTagName("url")[0].firstChild.nodeValue;

      var temp = xml.getElementsByTagName("temperature")[0];
      var max = temp.firstElementChild.children[0].textContent; // 摂氏
      var min = temp.lastElementChild.children[0].textContent;
      if (max == "") { max = "--"; }
      if (min == "") { min = "--"; }

      temp_str = M({ja: "[最高/最低気温]", en: "[high/low degrees"}) + " : " + max + "/" + min;
	  
      alertsService.showAlertNotification(imgurl, city_name, "[" + title + "] " + telop + "   " + temp_str,
                                          true, link, listener);
    }
  };

  xhr.open("GET", target, true);
  xhr.setRequestHeader("Content-Type", "text/xml");
  xhr.send("");
}


function weather_search() {
  prompt.selector({message: "Select City",
                   collection: cityList,
				   flags: [0, 0, HIDDEN],
				   header: ["City", "Area", ""],
				   actions: actions});  
}

ext.add("weather_search", weather_search,
        M({ja: '日本各都市の天気情報を表示',
           en: "Weather information on Japanese each city is displayed"}));