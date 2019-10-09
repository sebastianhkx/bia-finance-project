function AJAX(url, callback)
{
    var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");
    request.open("GET", url, true);
//    request.open("GET", url, false);
//    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function()
    {
        if (request.readyState == 4 && request.status == 200)
        {
            if (request.responseText)
            {
                callback(request.responseText);
            }
        }
    };
    request.send(null);
}
