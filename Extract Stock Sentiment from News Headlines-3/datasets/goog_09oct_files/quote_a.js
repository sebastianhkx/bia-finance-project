(function () {
    var elId = 'quote-ad';
    var cookieName = 'quoteAd';

    try {
        if (!getCookie(cookieName)) {
            var el = document.getElementById(elId);
            el.style.display = 'block';
            ga && ga('send', 'event', 'bannerQuote', 'impression', { 'nonInteraction': 1 });
        }
    } catch (e) { }

    Finviz = window.Finviz || {};
    Finviz.quoteAd = {};
    Finviz.quoteAd.close = function () {
        var expires = new Date();
        expires.setMonth(expires.getMonth() + 1);
        setCookie(cookieName, 'hidden', expires);

        var el = document.getElementById(elId);
        el.style.display = 'none';

        ga && ga('send', 'event', 'bannerQuote', 'close', { 'nonInteraction': 1 });
    };

    function getCookie(name) {
        var re = new RegExp("(?:(?:^|.*;\\s*)" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        return document.cookie.replace(re, "$1");
    }

    function setCookie(name, value, expires) {
        var cookie = name + "=" + value + "; expires=" + expires.toUTCString();
        if (document.location.hostname !== "localhost") {
            cookie += "; domain=.finviz.com";
        }
        document.cookie = cookie;
    }
})();