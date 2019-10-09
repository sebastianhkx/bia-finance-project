function lightup(imgName)
{
    if (document.images)
    {
        imgOn=eval(imgName + "_on.src");
        document[imgName].src = imgOn;
    }
}

function turnoff(imgName)
{
    if (document.images)
    {
        imgOff=eval(imgName + "_off.src");
        document[imgName].src = imgOff;
    }
}
