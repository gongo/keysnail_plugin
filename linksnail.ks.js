var PLUGIN_INFO =
<KeySnailPlugin>
    <name>LinkSnail</name>
    <name lang="ja">LinkSnail</name>
    <description>Get link on the page currently open for Variety format (Markdown, org-mode, etc..)</description>
    <description lang="ja">現在開いているページへのリンクを、様々な形式 (Markdown や org-mode など)で取得します</description>
    <version>0.1</version>
    <author mail="gonngo@gmail.com" homepage="http://d.hatena.ne.jp/gongoZ/">gongoZ</author>
    <license>MAHALO License</license>
    <license lang="ja">MAHALO ライセンス</license>
    <include>main</include>
    <detail><![CDATA[
=== Usage ===
Nothing.
    ]]></detail>
    <detail lang="ja"><![CDATA[
=== 使い方 ===
なし。
    ]]></detail>
</KeySnailPlugin>;

var linksnail =
    (function() {
        var formatCollection = [
            ["Markdown"         , "[text](uri)"],
            ["Org-mode"         , "[[uri][text]]"],
            ["Textile"          , "\"text\":uri"],
            ["reStructuredText" , "`text` <uri>"]
        ];

        var self = {
            formatSelector: function() {
                prompt.selector({
                    message    : "get link",
                    collection : formatCollection,
                    header     : ["name", "syntax"],
                    callback   : function(index) {
                        var uri    = content.location.href;
                        var text   = content.document.title;
                        var format = formatCollection[index][1];
                        var link   = "";

                        link = format.replace("uri", uri);
                        link = link.replace("text", text);

                        return display.prettyPrint(link);
                    }
                });
            }
        };

        return self;
    })();

plugins.withProvides(function (provide) {
    provide("linksnail", function() {
        linksnail.formatSelector();
    }, "Prev page");
}, PLUGIN_INFO);
