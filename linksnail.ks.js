var PLUGIN_INFO =
<KeySnailPlugin>
    <name>LinkSnail</name>
    <name lang="ja">LinkSnail</name>
    <updateURL>https://raw.github.com/gongo/keysnail_plugin/master/linksnail.ks.js</updateURL>
    <description>Get link on the page currently open for Variety format (Markdown, org-mode, etc..)</description>
    <description lang="ja">現在開いているページへのリンクを、様々な形式 (Markdown や org-mode など)で取得します</description>
    <version>0.1.1</version>
    <author mail="gonngo@gmail.com" homepage="http://d.hatena.ne.jp/gongoZ/">gongoZ</author>
    <license>MAHALO License</license>
    <license lang="ja">MAHALO ライセンス</license>
    <include>main</include>
    <detail><![CDATA[
=== Overview ===
Get a link to the page currently open in a variety of formats (Markdown, org-mode, etc..),
and copy it to the clipboard.
It is also possible to get and copy links of all the tabs on current window.

=== Support Format ===
- Markdown
- Org-mode
- Textile
- reStructuredText
- HTML
- Plain
- URI

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
また、現在のWindowで開いているタブ全てのリンクをコピーすることもできます。

=== 対応フォーマット ===
- Markdown
- Org-mode
- Textile
- reStructuredText
- HTML
- Plain
- URI

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
            ["Markdown"         , "[{text}]({uri})"],
            ["Org-mode"         , "[[{uri}][{text}]]"],
            ["Textile"          , "\"{text}\":{uri}"],
            ["reStructuredText" , "`{text}` <{uri}>"],
            ["HTML"             , "<a href=\"{uri}\">{text}</a>"],
            ["Plain"            , "{text} / {uri}"],
            ["URI"              , "{uri}"],
        ];

        function copyLink(link){
            const CLIPBOARD = Components.classes[
                '@mozilla.org/widget/clipboardhelper;1'
            ].getService(Components.interfaces.nsIClipboardHelper);

            CLIPBOARD.copyString(link);
        };

        function formatTextAndURI(format, text, uri){
            var link = "";
            link = format.replace("{uri}", uri);
            link = link.replace("{text}", text);
            return link;
        };

        function formatSelector(next) {
            prompt.selector({
                message    : "Select format",
                collection : formatCollection,
                header     : ["name", "syntax"],
                callback   : next,
            });
        };

        var self = {
            copyThisPage : function() {
                formatSelector(function(index){
                    var uri    = content.location.href;
                    var text   = content.document.title;
                    var format = formatCollection[index][1];

                    copyLink(formatTextAndURI(format, text, uri));
                });
            },
            copyAllPage : function() {
                formatSelector(function(index){
                    var format = formatCollection[index][1];
                    var a = [(function(){
                        var browser = tab.linkedBrowser;
                        var win     = browser.contentWindow;

                        var text = tab.label;
                        var url   = win.location.href;
                        return formatTextAndURI(format, text, url);
                    })() for each (tab in Array.slice(gBrowser.mTabContainer.childNodes))];

                    copyLink(a.join("\n"));
                })
            },
        };

        return self;
    })();

plugins.withProvides(function (provide) {
    provide("linksnail", function() {
        linksnail.copyThisPage();
    }, "LinkSnail");
    provide("linksnail-copy-all", function() {
        linksnail.copyAllPage();
    }, "LinkSnail Copy all tabs");
}, PLUGIN_INFO);
