var PLUGIN_INFO =
<KeySnailPlugin>
    <name>LinkSnail</name>
    <name lang="ja">LinkSnail</name>
    <updateURL>https://raw.github.com/gongo/keysnail_plugin/master/linksnail.ks.js</updateURL>
    <description>Get link on the page currently open for Variety format (Markdown, org-mode, etc..)</description>
    <description lang="ja">現在開いているページへのリンクを、様々な形式 (Markdown や org-mode など)で取得します</description>
    <version>0.3.0</version>
    <author mail="gonngo@gmail.com" homepage="http://d.hatena.ne.jp/gongoZ/">gongoZ</author>
    <license>MAHALO License</license>
    <license lang="ja">MAHALO ライセンス</license>
    <include>main</include>
    <minVersion>1.8.5</minVersion>
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

var pOptions = plugins.setupOptions("linksnail", {
    "formats": {
        preset: {
            "Markdown": "[{text}]({uri})",
            "Org-mode": "[[{uri}][{text}]]",
            "Textile": "\"{text}\":{uri}",
            "reStructuredText": "`{text}` <{uri}>",
            "HTML": "<a href=\"{uri}\">{text}</a>",
            "Plain": "{text} / {uri}",
            "URI": "{uri}"
        },
        description: M({
            en: "Link formats object. `format` is either String or Function. If it's String it's the format template, where \"{text}\" and \"{uri}\" are replaced when linksnail is activated. If it's Function, it's called with three arguments (`text`, `uri`, `window`), and it should return the formatted link.",
            jp: "リンクフォーマットオブジェクト。`format`はStringもしくはFunctionです。Stringの場合、これはフォーマットテンプレート文字列となります。linksnail起動時にテンプレート内の\"{text}\"と\"{uri}\"が置換されます。Functionの場合、3つの引数(`text`, `uri`, `window`)で呼び出されます。この関数はフォーマットしたリンク文字列を返す必要があります。"
        }),
        type: "object ({format_name: format, ... })."
    }
}, PLUGIN_INFO);


var linksnail =
    (function() {
        function getFormatCollection() {
            return Object.keys(pOptions["formats"]).map(function(format_name) {
                var general_format = pOptions["formats"][format_name];
                var desc = _.isFunction(general_format) ? "" : general_format;
                return [format_name, desc];
            });
        };

        function copyLink(link){
            const CLIPBOARD = Components.classes[
                '@mozilla.org/widget/clipboardhelper;1'
            ].getService(Components.interfaces.nsIClipboardHelper);

            CLIPBOARD.copyString(link);
        };

        function windowText(win) { return win.document.title; };
        function windowURI(win) { return win.location.href; };

        function getFormatter(format_name) {
            var general_format = pOptions["formats"][format_name];
            if(_.isFunction(general_format)) {
                return function(win) {
                    return general_format(windowText(win), windowURI(win), win);
                };
            }else {
                return function(win) {
                    var link = "";
                    link = general_format.replace(/\{uri\}/g, windowURI(win));
                    link = link.replace(/\{text\}/g, windowText(win));
                    return link;
                };
            }
        };

        function formatSelector(next) {
            prompt.selector({
                message    : "Select format",
                collection : getFormatCollection(),
                header     : ["name", "syntax"],
                callback   : next,
            });
        };

        var self = {
            copyThisPage : function() {
                formatSelector(function(index, collection){
                    var formatter = getFormatter(collection[index][0]);
                    copyLink(formatter(content));
                });
            },
            copyAllPage : function() {
                formatSelector(function(index, collection){
                    var formatter = getFormatter(collection[index][0]);
                    var a = Array.from(gBrowser.mTabContainer.childNodes).map(function(tab) {
                        var browser = tab.linkedBrowser;
                        var win     = browser.contentWindow;
                        return formatter(win);
                    });
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
