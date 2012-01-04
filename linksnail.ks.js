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
=== Overview ===
Get link on the page currently open for Variety format (Markdown, org-mode, etc..).
And copies it to the clipboard.

=== Usage ===
>||
key.setGlobalKey(['C-c', 't'], function (ev, arg) {
    ext.exec('linksnail', arg, ev);
}, 'LinkSnail', true);
||<
    ]]></detail>
    <detail lang="ja"><![CDATA[
=== 概要 ===
現在開いているページへのリンクを、様々な形式 (Markdown や org-mode など)で取得します。
取得したリンクはクリップボードにコピーされます。

=== 使い方 ===
>||
key.setGlobalKey(['C-c', 't'], function (ev, arg) {
    ext.exec('linksnail', arg, ev);
}, 'LinkSnail', true);
||<
    ]]></detail>
</KeySnailPlugin>;

var linksnail =
    (function() {
        var formatCollection = [
            ["Markdown"         , "[text](uri)"],
            ["Org-mode"         , "[[uri][text]]"],
            ["Textile"          , "\"text\":uri"],
            ["reStructuredText" , "`text` <uri>"],
            ["HTML"             , "<a href=\"uri\">text</a>"],
            ["Plain"            , "text / uri"]
        ];

        var self = {
            formatSelector: function() {
                prompt.selector({
                    message    : "Select format",
                    collection : formatCollection,
                    header     : ["name", "syntax"],
                    callback   : function(index) {
                        var uri    = content.location.href;
                        var text   = content.document.title;
                        var format = formatCollection[index][1];
                        var link   = "";

                        link = format.replace("uri", uri);
                        link = link.replace("text", text);

                        const CLIPBOARD = Components.classes[
                            '@mozilla.org/widget/clipboardhelper;1'
                        ].getService(Components.interfaces.nsIClipboardHelper);

                        CLIPBOARD.copyString(link);
                    }
                });
            }
        };

        return self;
    })();

plugins.withProvides(function (provide) {
    provide("linksnail", function() {
        linksnail.formatSelector();
    }, "LinkSnail");
}, PLUGIN_INFO);
