/**
 * @fileOverview
 * @name excite-translation.js
 * @description Excite Translation (http://www.excite.co.jp/world) client
 * @author gongo <gonngo@gmail.com>
 * @license The MIT License
 */

/**
 * Require:
 * 
 *   ecl.js  (Escape Codec Library: http://tinyurl.com/27cml3)
 *
 *   userscript.addLoadPath(path/to/file);
 *   userscript.require("ecl.js");
 *
 * Usage
 *
 * Paste this code to your keysnail.js file.
 *
 * Press 'C-1' key (or your defined one) to start this client.
 *
 * First, select the translation method (ex. ja -> en, en->ja).
 * Next, input string of the target, and push Enter key.
 *
 * The result of the translation is displayed by pop up.
 */

key.setGlobalKey('C-1', function (ev, arg) {
    var trans_list = [];
    var JAEN = 0;
    var ENJA = 1;
 
    trans_list[JAEN] = ["je", "\u82F1\u548C"];
    trans_list[ENJA] = ["ej", "\u548C\u82F1"];

function prettyPrint(msg, milisec) {
    if (!content || util.isFrameSetWindow(content)) {
        return;
    }
 
    function hideMessage () {
        container.style.display = 'none';
    }
    
    var doc = content.document;
    var dBody = doc.body;
    
    if (dBody) {
        var ksMessageId = "_ks_message";
        var ksMessageStyle =
            "z-index: 500; font-size: 30px; font-family: 'Bitstream Vera Sans Mono';"
            + " padding: 10px; margin: 3px; color: #ff5e61; background-color: #111111;"
            + " -moz-opacity: 0.7; opacity: 0.7; position: fixed; -moz-border-radius: 5px;"
            + " top: 0.5em; right: 0.5em;";
        
        var lines = msg.split('\n');
        var container = doc.getElementById(ksMessageId);
        
        if (!container) {
            container = doc.createElement("div");
            container.id = ksMessageId;
            container.style.cssText = ksMessageStyle;
          
            container.addEventListener('click', hideMessage, true);
          
            dBody.appendChild(container);
        } else {
            // clear
            while (container.hasChildNodes()) {
                container.removeChild(container.firstChild);
            }
        }
        
        container.appendChild(doc.createTextNode(lines[0]));
        for (var i = 1; i < lines.length; ++i) {
            container.appendChild(doc.createElement("br"));
            container.appendChild(doc.createTextNode(lines[i]));
        }
        
        container.style.display = 'block';
 
        if (milisec) {
            setTimeout(hideMessage, milisec);
        }
    }
}
    
    prompt.selector({
        message: "Select Translation",
        collection: trans_list,
        callback: function (sel) {
            prompt.read("String: ", function (input, trans) {
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

                var xhr = createHttpRequest();
                xhr.onreadystatechange = function (aEvent) {
                    if (xhr.readyState == 4) {
                        if (xhr.status != 200) {
                            return;
                        }
                        var text = xhr.responseText;
                        text.match(/<textarea [^>]+before[^>]+>(.+)<\/textarea>/i);
			before = RegExp.$1;
			text.match(/<textarea [^>]+after[^>]+>(.+)<\/textarea>/i);
			after = RegExp.$1;
			//display.prettyPrint(before + "\n\n" + after);
			prettyPrint(before + "\n\n" + after, 2000);
                    }
                };
                var uri = "http://www.excite.co.jp/world/english/?";
                var direction = "";
                if (trans == JAEN) {
                    direction = "JAEN";
                } else {
                    direction = "ENJA";
                }
                xhr.overrideMimeType("text/html; charset=Shift_JIS");
                xhr.open("GET", uri + "wb_lp=" + direction + "&before=" + EscapeSJIS(input), true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send("");
            },
            sel);
        }
    });
}, 'ExciteTranslation');