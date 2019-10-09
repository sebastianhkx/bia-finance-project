var quoteRefresh;
var quoteRefreshChecks = 0;
var quoteRefreshChecksBeforeFullRefresh = 15;
var quoteTickers;
var quoteLastVolume;

function QuoteRefreshInit(refresh, tickers) {
    quoteRefresh = refresh * 1000;
    quoteTickers = tickers;
    setTimeout(QuoteRefresh, quoteRefresh);
}

function QuoteRefresh() {
    if (quoteRefreshChecks < quoteRefreshChecksBeforeFullRefresh) {
        quoteRefreshChecks++;
        AJAX('/request_quote_volume.ashx?t=' + quoteTickers + '&rev=' + (+new Date()), function (data) {
            if (data == quoteLastVolume) {
                return;
            }

            quoteLastVolume = data;
            QuoteRefreshCharts();
        });
    } else {
        QuoteRefreshCharts();
    }

    setTimeout(QuoteRefresh, quoteRefresh);
}

function QuoteRefreshCharts() {
    quoteRefreshChecks = 0;

    var rev = new Date().getTime();
    var chartIndex;
    for (chartIndex = 0; ; chartIndex++) {
        el = document.getElementById("chart" + chartIndex);
        if (el == null)
            break;

        src = el.src;
        srcRevPos = src.indexOf("&rev=");
        if (srcRevPos >= 0)
            src = src.substr(0, srcRevPos);
        src = src + "&rev=" + rev;
        el.src = src;
    }
}

function Publish(url) {
    window.open('publish.ashx?' + url, '', 'top=100,left=100,width=950,height=520');
}
