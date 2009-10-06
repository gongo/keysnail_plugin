key.setGlobalKey('C-2', function (ev, arg) {
    var title = window.content.document.title;
    var target = encodeURIComponent(window.content.location.href);
    var uri = "http://tinyurl.com/api-create.php?url=";

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
                alert("I'm sorry, can't make tiny url");
                return;
            }
            var text = xhr.responseText;
            alert(title + " " + text);
        }
    };

    xhr.open("GET", uri + target, true);
    xhr.send("");
}, 'MakeTinyURL');
