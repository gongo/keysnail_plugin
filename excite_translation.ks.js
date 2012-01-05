var PLUGIN_INFO =
<KeySnailPlugin>
    <name>Excite Translation client</name>
    <name lang="ja">エキサイト翻訳クライアント on KeySnail</name>
    <description>Translation (ja, en, etc...)</description>
    <description lang="ja">エキサイト翻訳を KeySnail から利用する</description>
    <version>1.12</version>
    <updateURL>http://github.com/gongo/keysnail_plugin/raw/master/excite_translation.ks.js</updateURL>
    <author mail="gonngo+github@gmail.com" homepage="http://d.hatena.ne.jp/gongoZ/">gongoZ</author>
    <license>MAHALO License</license>
    <license lang="ja">MAHALO ライセンス</license>
    <provides>
        <ext>excite_translation</ext>
    </provides>
    <detail lang="ja"><![CDATA[
=== 使い方 ===
==== 起動 ====
M-x (または ext.select() を呼出すキーバインド) から excite_translation を選ぶと起動します。
次のようにして任意のキーへコマンドを割り当てておくことも可能です。
>||
key.setViewKey(["C-x", "C-c", "e"],
    function (ev, arg) {
        ext.exec("excite_translation", arg);
    }, ext.description("excite_translation"), true);
||<
例えば上記のような設定を初期化ファイル(.keysnail.jsなど)へ記述しておくことにより、ブラウズ画面で C-x C-c e と押すことで起動します。

==== アクションの選択 ====
起動すると、英和、和英など翻訳の種類一覧が出ます。
この中から翻訳したい方向を選んだあと、次に出てくるフォームに、翻訳したい原文が出てきます。
入力し終わって Enter を押すと、popup で原文と翻訳後の文章が出ます。

==== 翻訳できる言語の種類 ====
- 和英、英和
- 和仏、仏和、英仏、仏英
- 和独、独和、英独、独英
- 和伊、伊和、伊英、英伊

]]></detail>
</KeySnailPlugin>;

var excite_translation =
    (function() {
        var trans_list = new Array;

        trans_list.push([M({en:"Japanese to English", ja:"日本語から英語へ"}),      "english", "JAEN"]);
        trans_list.push([M({en:"English to Japanese", ja:"英語から日本語へ"}),      "english", "ENJA"]);
        trans_list.push([M({en:"Japanese to French",  ja:"日本語からフランス語へ"}), "french", "JAFR"]);
        trans_list.push([M({en:"French to Japanese",  ja:"フランス語から日本語へ"}), "french", "FRJA"]);
        trans_list.push([M({en:"English to French",   ja:"英語からフランス語へ"}),   "french", "ENFR"]);
        trans_list.push([M({en:"French to English",   ja:"フランス語から英語へ"}),   "french", "FREN"]);
        trans_list.push([M({en:"Japanese to German",  ja:"日本語からドイツ語へ"}),   "german", "JADE"]);
        trans_list.push([M({en:"German to Japanese",  ja:"ドイツ語から日本語へ"}),   "german", "DEJA"]);
        trans_list.push([M({en:"English to German",   ja:"英語からドイツ語へ"}),     "german", "ENDE"]);
        trans_list.push([M({en:"German to English",   ja:"ドイツ語から英語へ"}),     "german", "DEEN"]);
        trans_list.push([M({en:"Japanese to Italian", ja:"日本語からイタリア語へ"}), "italian", "JAIT"]);
        trans_list.push([M({en:"Italian to Japanese", ja:"イタリア語から日本語へ"}), "italian", "ITJA"]);
        trans_list.push([M({en:"English to Italian",  ja:"英語からイタリア語へ"}),   "italian", "ENIT"]);
        trans_list.push([M({en:"Italian to English",  ja:"イタリア語から英語へ"}),   "italian", "ITEN"]);

        function readString(sel) {
            prompt.read("String: ", function (input, trans) {
                var xhr = XMLHttpRequest();

                xhr.onreadystatechange = function (aEvent) {
                    if (xhr.readyState == 4) {
                        if (xhr.status != 200) {
                            return;
                        }
                        var text = xhr.responseText;
                        text.match(/<textarea [^>]+before[^>]+>(.+)<\/textarea>/i);
                        var before = RegExp.$1;
                        text.match(/<textarea [^>]+after[^>]+>(.+)<\/textarea>/i);
                        var after = RegExp.$1;
                        display.prettyPrint(before + "\n\n" + after, { timeout:10000, fade:100 });
                    }
                };

                var type = trans_list[trans][1];
                var direction = trans_list[trans][2];
                var uri = "http://www.excite.co.jp/world/" + type + "/";
                var str = encodeURIComponent(input);

                xhr.open("POST", uri, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send("wb_lp=" + direction + "&before=" + str);
            },
                        sel);
        }


        var self = {
            languageSelector: function() {
                prompt.selector({
                    message: "Select Translation",
                    collection: trans_list,
                    flags: [0, HIDDEN, HIDDEN],
                    callback: function (sel) {readString(sel);}
                });
            }
        };

        return self;
    })();

plugins.withProvides(function (provide) {
    provide("excite_translation", function() {
        excite_translation.languageSelector();
    }, M({ja: 'エキサイト翻訳しましょう',
          en: "Let's Translation"}));
}, PLUGIN_INFO);
