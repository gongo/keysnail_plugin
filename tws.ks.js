var PLUGIN_INFO =
<KeySnailPlugin>
    <name>tws</name>
    <name lang="ja">tws</name>
    <updateURL>https://raw.github.com/gongo/keysnail_plugin/master/tws.ks.js</updateURL>
    <description>Search for Twitter</description>
    <description lang="ja">Twitter 検索画面を開くだけ</description>
    <version>0.1</version>
    <author mail="gonngo@gmail.com" homepage="http://d.hatena.ne.jp/gongoZ/">gongoZ</author>
    <license>MAHALO License</license>
    <license lang="ja">MAHALO ライセンス</license>
    <include>main</include>
</KeySnailPlugin>;

var tws =
    (function() {
        var uri = "https://twitter.com/#!/search/";

        var self = {
            run: function() {
                prompt.read("String: ", function (keyword) {
                    var key = encodeURIComponent(keyword);
                    window.open(uri + key);
                })
            }
        };

        return self;
    })();

plugins.withProvides(function (provide) {
    provide("tws", function() {
        tws.run();
    }, "tws");
}, PLUGIN_INFO);
