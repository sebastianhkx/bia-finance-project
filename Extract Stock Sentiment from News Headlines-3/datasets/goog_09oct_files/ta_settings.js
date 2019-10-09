function TASettingsSubmit(form)
{
    SetError("");
    
    // overlays
    for (row = 1; row <= 5; ++row)
    {
        var error = "";
        
        var overlay = form.elements["overlay" + row].value;
        if (overlay == "none")
            continue;            

        var overlayParam = TrimString(form.elements["overlay" + row + "_param"].value);
        var overlayParamArray = overlayParam.split(",");
        for (p = 0; p < overlayParamArray.length; ++p)
            overlayParamArray[p] = TrimString(overlayParamArray[p]);
        if (overlayParamArray.length > 0 && overlayParamArray[overlayParamArray.length - 1].length == 0)
            overlayParamArray.pop(); // vyhodime prazdny parameter
        
        switch (overlay)
        {
            case "bb":
                if (overlayParamArray.length < 2)
                    error = "Please enter period and number of deviations"; 
                else if (!IsValidPeriod(overlayParamArray[0]))
                    error = "Period must be whole number greater or equal than 1";
                else if (!IsValidFloatGZ(overlayParamArray[1]))
                    error = "Number of deviations must be greater than 0";
                break;
            case "sma":
            case "sma2":                
            case "ema":
            case "ema2":
            case "hilo":
                if (overlayParamArray.length < 1)
                    error = "Please enter period"; 
                else if (!IsValidPeriod(overlayParamArray[0]))
                    error = "Period must be whole number greater or equal than 1";
                break;            
            case "sar":
                if (overlayParamArray.length < 2)
                    error = "Please enter step and maximum"; 
                else if (!IsValidFloatGZ(overlayParamArray[0]))
                    error = "Step must be greater than 0";
                else if (!IsValidFloatGZ(overlayParamArray[1]))
                    error = "Maximum must be greater than 0";
                break;
            case "hline":
                if (overlayParamArray.length < 1)
                    error = "Please enter price"; 
                else if (!IsValidFloatGZ(overlayParamArray[0]))
                    error = "Price must be greater than 0";
                break;
        }
        
        if (error.length > 0)
        {
            SetError(error);
            form.elements["overlay" + row + "_param"].focus();
            return false;
        } 
    }
    
    // indicators
    for (row = 1; row <= 5; ++row)
    {
        var error = "";
        
        var indicator = form.elements["indicator" + row].value;
        if (indicator == "none")
            continue;            

        var indicatorParam = TrimString(form.elements["indicator" + row + "_param"].value);
        var indicatorParamArray = indicatorParam.split(",");
        for (p = 0; p < indicatorParamArray.length; ++p)
            indicatorParamArray[p] = TrimString(indicatorParamArray[p]);
        if (indicatorParamArray.length > 0 && indicatorParamArray[indicatorParamArray.length - 1].length == 0)
            indicatorParamArray.pop(); // vyhodime prazdny parameter
        
        switch (indicator)
        {
            case "adx":
            case "atr":
            case "cci":
            case "fi":
            case "mfi":
            case "rwi":
            case "roc":
            case "rsi":
            case "trix":
            case "wr":
                if (indicatorParamArray.length < 1)
                    error = "Please enter period"; 
                else if (!IsValidPeriod(indicatorParamArray[0]))
                    error = "Period must be whole number greater or equal than 1";
                break;
            case "macd":
            case "stofu":
            case "ult":
                if (indicatorParamArray.length < 3)
                    error = "Please enter 3 periods"; 
                else if (!IsValidPeriod(indicatorParamArray[0]) || !IsValidPeriod(indicatorParamArray[1]) || !IsValidPeriod(indicatorParamArray[2]))
                    error = "Period must be whole number greater or equal than 1";
                break;
            case "perf":
                break;
            case "rmi":
                if (indicatorParamArray.length < 2)
                    error = "Please enter period and momentum"; 
                else if (!IsValidPeriod(indicatorParamArray[0]))
                    error = "Period must be whole number greater or equal than 1";
                else if (!IsValidPeriod(indicatorParamArray[1]))
                    error = "Momentum must be whole number greater or equal than 1";
                break;
            case "stosl":
            case "stofa":
                if (indicatorParamArray.length < 2)
                    error = "Please enter 2 periods"; 
                else if (!IsValidPeriod(indicatorParamArray[0]) || !IsValidPeriod(indicatorParamArray[1]))
                    error = "Period must be whole number greater or equal than 1";                        
                break;
        }
        
        if (error.length > 0)
        {
            SetError(error);
            form.elements["indicator" + row + "_param"].focus();
            return false;
        } 
    }
        
    return true;
}

function TASettingsChangeOverlay(row)
{
    form = document.forms["ta_settings"];    
    overlay = form.elements["overlay" + row].value;
        
    value = "";
    switch (overlay)
    {        
        case "bb": 
            value = "20,2"; 
            break;
        case "sma":
        case "sma2":                
        case "ema":
        case "ema2":
            value = "50";
            break;        
        case "hilo":
            value = "50";
            break;     
        case "sar":
            value = "0.02,0.2";
            break;
        case "hline":
            value = "";
            break;
    }
    
    param = form.elements["overlay" + row + "_param"];
    param.value = value;
    if (overlay != "none")
        param.focus();
}

function TASettingsChangeIndicator(row)
{
    form = document.forms["ta_settings"];    
    indicator = form.elements["indicator" + row].value;
        
    value = "";
    switch (indicator)
    {        
        case "rwi":
        case "trix":
            value = "9";
            break;    
        case "roc":
            value = "12";
            break;         
        case "adx":
        case "atr":
        case "mfi":
        case "rsi":
        case "wr":
            value = "14";
            break;
        case "cci":
            value = "20";
            break;
        case "fi":
            value = "13";
            break;            
        case "macd":
            value = "12,26,9";
            break;
        case "stofu":
            value = "14,3,3";
            break;
        case "stosl":        
        case "stofa":
            value = "14,3";
            break;
        case "ult":
            value = "7,14,28";
            break;
        case "perf":
            value = "SPY,QQQ";
            break;
        case "rmi":
            value = "20,5";
            break;
    }
    
    param = form.elements["indicator" + row + "_param"];
    param.value = value;
    if (indicator != "none")
        param.focus(); 
}

function TASettingsDefaults()
{
    form = document.forms["ta_settings"];
     
    form.elements["style"][0].checked = true;
    form.elements["style"][1].checked = false;
    form.elements["style"][2].checked = false;

    if (form.elements["scheme"]) {
        form.elements["scheme"][0].checked = true;
        form.elements["scheme"][1].checked = false;
        form.elements["scheme"][2].checked = false;
    }
    
    form.elements["overlay1"].value = "sma";
    form.elements["overlay1_param"].value = "50";
    form.elements["overlay2"].value = "sma";
    form.elements["overlay2_param"].value = "200";
    form.elements["overlay3"].value = "sma";
    form.elements["overlay3_param"].value = "20";
    form.elements["overlay4"].value = "none";
    form.elements["overlay4_param"].value = "";
    form.elements["overlay5"].value = "none";
    form.elements["overlay5_param"].value = "";

    form.elements["indicator1"].value = "rsi";
    form.elements["indicator1_param"].value = "14";
    form.elements["indicator1_position"].value = "b";
    form.elements["indicator2"].value = "none";
    form.elements["indicator2_param"].value = "";
    form.elements["indicator2_position"].value = "b";
    form.elements["indicator3"].value = "none";
    form.elements["indicator3_param"].value = "";
    form.elements["indicator3_position"].value = "b";
    form.elements["indicator4"].value = "none";
    form.elements["indicator4_param"].value = "";
    form.elements["indicator4_position"].value = "b";
    form.elements["indicator5"].value = "none";
    form.elements["indicator5_param"].value = "";
    form.elements["indicator5_position"].value = "b";    
    
    form.submit();
}

function IsValidPeriod(n)
{
    if (n.length == 0 || n.indexOf(".") >= 0 || n.indexOf("e") >= 0 || isNaN(n))
        return false;
    if (parseInt(n) < 1)
        return false;
    return true;
}

function IsValidFloatGZ(n)
{
    if (n.length == 0 || n.indexOf("e") >= 0 || isNaN(n))
        return false;
    if (parseFloat(n) <= 0)
        return false;
    return true;
}

function SetError(error)
{
    document.getElementById("ta_settings_error").innerHTML = error;
}

function TrimString(str)
{
    while (str.charAt(0) == ' ')
        str = str.substring(1);
    while (str.charAt(str.length - 1) == ' ')
        str = str.substring(0, str.length - 1);
    return str;
}
