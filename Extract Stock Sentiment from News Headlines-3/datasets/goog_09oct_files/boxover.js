/* --- BoxOver ---
/* --- v 2.1 17th June 2006
By Oliver Bryant with help of Matthew Tagg
http://boxover.swazz.org */

if(typeof document.attachEvent!='undefined') {
  window.attachEvent('onload',init);
  document.attachEvent('onmousemove',moveMouse);
  document.attachEvent('onclick',checkMove);
} else {
  window.addEventListener('DOMContentLoaded',init,false);
  document.addEventListener('mousemove',moveMouse,false);
  document.addEventListener('click',checkMove,false);
}

var oDv=document.createElement("div");
var dvHdr=document.createElement("div");
var dvBdy=document.createElement("div");

//[RD] The iframe which will hide selects in IE
var ifCover = document.createElement("iframe");

var windowlock, boxMove, fixposx, fixposy, lockX, lockY, fixx, fixy;
var ox, oy, boxLeft, boxRight, boxTop, boxBottom, evt, mouseX, mouseY;
var boxOpen, totalScrollTop, totalScrollLeft;
boxOpen=false;
ox=10;
oy=10;
lockX=0;
lockY=0;

function init() {

  oDv.appendChild(dvHdr);
  oDv.appendChild(dvBdy);
  oDv.style.position="absolute";
  oDv.style.visibility='hidden';
  oDv.style.zIndex = '11'; //[RD]
  document.body.appendChild(oDv);

  //[RD] setup iframe for hiding selects under boxover (mod by [AH] for visibility & fade)
  ifCover.style.visibility='hidden'; //[AH]
  ifCover.style.filter = 'alpha(opacity=0)'; // IE
  ifCover.style.opacity = '0'; // FF
  ifCover.style.left = '0';
  ifCover.style.top = '0';
  ifCover.style.width = '0';
  ifCover.style.height = '0';
  ifCover.style.position = 'absolute';
  ifCover.style.zIndex = '10'; // set to appear behind boxover
  ifCover.src = 'javascript:false;';
  ifCover.frameBorder = '0';
  ifCover.scrolling = 'no';
  document.body.appendChild(ifCover);
}

function defHdrStyle() {
  dvHdr.innerHTML='<img style="vertical-align:middle" src="/gfx/info.gif">&nbsp;&nbsp;'+dvHdr.innerHTML;
  dvHdr.style.fontWeight='bold';
  dvHdr.style.width='150px';
  dvHdr.style.fontFamily='arial';
  dvHdr.style.border='2px solid #255C7B';
  dvHdr.style.borderBottom='1px solid #002962';
  dvHdr.style.padding='3';
  dvHdr.style.fontSize='11';
  dvHdr.style.color='#255C7B';
  dvHdr.style.background='#CAD65E';
  dvHdr.style.filter='alpha(opacity=85)'; // IE
  dvHdr.style.opacity='0.85'; // FF
}

function defBdyStyle() {
  dvBdy.style.borderBottom='2px solid #255C7B';
  dvBdy.style.borderLeft='2px solid #255C7B';
  dvBdy.style.borderRight='2px solid #255C7B';
  dvBdy.style.width='150px';
  dvBdy.style.fontFamily='arial';
  dvBdy.style.fontSize='11';
  dvBdy.style.padding='3';
  dvBdy.style.color='#1B4966';
  dvBdy.style.background='#FFFFFF';
  dvBdy.style.filter='alpha(opacity=85)'; // IE
  dvBdy.style.opacity='0.85'; // FF
}

function checkElemBO(txt) {
  if (!txt || typeof(txt) != 'string') return false;
  if ((txt.indexOf('header')>-1)&&(txt.indexOf('body')>-1)&&(txt.indexOf('[')>-1)&&(txt.indexOf('[')>-1))
    return true;
  else
    return false;
}

function scanBO(curNode) {

  if (checkElemBO(curNode.title)) {

    //[AH] check for manual opacity setting.
    curNode.opacity=getParam('opacity',curNode.title);
    if(curNode.opacity=='') curNode.opacity = '100';

    curNode.boHDR=getParam('header',curNode.title);
    curNode.boBDY=getParam('body',curNode.title);
    curNode.boCSSBDY=getParam('cssbody',curNode.title);
    curNode.boCSSHDR=getParam('cssheader',curNode.title);
    curNode.IEbugfix=(getParam('hideselects',curNode.title)=='on')?true:false;
    curNode.fixX=parseInt(getParam('fixedrelx',curNode.title));
    curNode.fixY=parseInt(getParam('fixedrely',curNode.title));
    curNode.absX=parseInt(getParam('fixedabsx',curNode.title));
    curNode.absY=parseInt(getParam('fixedabsy',curNode.title));
    curNode.offY=(getParam('offsety',curNode.title)!='')?parseInt(getParam('offsety',curNode.title)):10;
    curNode.offX=(getParam('offsetx',curNode.title)!='')?parseInt(getParam('offsetx',curNode.title)):10;
    curNode.fade=(getParam('fade',curNode.title)=='on')?true:false;
    curNode.fadespeed=(getParam('fadespeed',curNode.title)!='')?getParam('fadespeed',curNode.title):0.04;
    curNode.delay=(getParam('delay',curNode.title)!='')?parseInt(getParam('delay',curNode.title)):0;

    if (getParam('requireclick',curNode.title)=='on') {
      curNode.requireclick=true;
      document.all?curNode.attachEvent('onclick',showHideBox):curNode.addEventListener('click',showHideBox,false);
      document.all?curNode.attachEvent('onmouseover',hideBox):curNode.addEventListener('mouseover',hideBox,false);
    }
    else // Note : if requireclick is on the stop clicks are ignored
    {
      if (getParam('clickoff',curNode.title)=='on') { //[AH] enable the clickoff function.
        document.all?curNode.attachEvent('onmousedown',clickOff):curNode.addEventListener('mousedown',clickOff,false);
      }
      else
      {
        if (getParam('doubleclickstop',curNode.title)!='off') {
          document.all?curNode.attachEvent('ondblclick',pauseBox):curNode.addEventListener('dblclick',pauseBox,false);
        }
        if (getParam('singleclickstop',curNode.title)=='on') {
          document.all?curNode.attachEvent('onclick',pauseBox):curNode.addEventListener('click',pauseBox,false);
        }
      }
    }
    curNode.windowLock=getParam('windowlock',curNode.title).toLowerCase()=='off'?false:true;
    curNode.title='';
    curNode.hasbox=1;
  }
  else
    curNode.hasbox=2;
}


function getParam(param,list) {
  var reg = new RegExp('([^a-zA-Z]' + param + '|^' + param + ')\\s*=\\s*\\[\\s*(((\\[\\[)|(\\]\\])|([^\\]\\[]))*)\\s*\\]');
  var res = reg.exec(list);
  var returnvar;
  if(res)
    return res[2].replace('[[','[').replace(']]',']');
  else
    return '';
}

function Left(elem){
  var x=0;
  if (elem.calcLeft) return elem.calcLeft;
  var oElem=elem;
  while(elem){
    if ((elem.currentStyle)&& (!isNaN(parseInt(elem.currentStyle.borderLeftWidth)))&&(x!=0))
      x+=parseInt(elem.currentStyle.borderLeftWidth);
    x+=elem.offsetLeft;
    elem=elem.offsetParent;
  }
  oElem.calcLeft=x;
  return x;
}

function Top(elem){
  var x=0;
  if (elem.calcTop) return elem.calcTop;
  var oElem=elem;
  while(elem){
    if ((elem.currentStyle)&& (!isNaN(parseInt(elem.currentStyle.borderTopWidth)))&&(x!=0))
      x+=parseInt(elem.currentStyle.borderTopWidth);
    x+=elem.offsetTop;
    elem=elem.offsetParent;
  }
  oElem.calcTop=x;
  return x;
}

var ah,ab;
function applyStyles() {
  if(ab)
    oDv.removeChild(dvBdy);
  if (ah)
    oDv.removeChild(dvHdr);
  dvHdr=document.createElement("div");
  dvBdy=document.createElement("div");
  CBE.boCSSBDY?dvBdy.className=CBE.boCSSBDY:defBdyStyle();
  CBE.boCSSHDR?dvHdr.className=CBE.boCSSHDR:defHdrStyle();
  dvHdr.innerHTML=CBE.boHDR;
  dvBdy.innerHTML=CBE.boBDY;

  // apply preferred opacity
  dvHdr.style.filter='alpha(opacity=' + CBE.opacity + ')'; // IE
  dvHdr.style.opacity='' + (CBE.opacity / 100); // FF
  dvBdy.style.filter='alpha(opacity=' + CBE.opacity + ')'; // IE
  dvBdy.style.opacity='' + (CBE.opacity / 100); // FF

  ah=false;
  ab=false;
  if (CBE.boHDR!='') {
    oDv.appendChild(dvHdr);
    ah=true;
  }
  if (CBE.boBDY!=''){
    oDv.appendChild(dvBdy);
    ab=true;
  }
}

var CSE,iterElem,LSE,CBE,LBE, totalScrollLeft, totalScrollTop, width, height ;
var ini=false;

// Customised function for inner window dimension
function SHW() {
  if (document.body && (document.body.clientWidth !=0)) {
    width=document.body.clientWidth;
    height=document.body.clientHeight;
  }
  if (document.documentElement && (document.documentElement.clientWidth!=0) && (document.body.clientWidth + 20 >= document.documentElement.clientWidth)) {
    width=document.documentElement.clientWidth;
    height=document.documentElement.clientHeight;
  }
  return [width,height];
}

var ID=null;
function moveMouse(e) {

  //boxMove=true;
  e?evt=e:evt=event;

  CSE=evt.target?evt.target:evt.srcElement;

  if (!CSE.hasbox) {
    // Note we need to scan up DOM here, some elements like TR don't get triggered as srcElement
    iElem=CSE;
    while ((iElem.parentNode) && (!iElem.hasbox)) {
      scanBO(iElem);
      iElem=iElem.parentNode;
    }
  }

  if ((CSE!=LSE)&&(!isChild(CSE,dvHdr))&&(!isChild(CSE,dvBdy))){
     if (!CSE.boxItem) {
      iterElem=CSE;
      while ((iterElem.hasbox==2)&&(iterElem.parentNode))
          iterElem=iterElem.parentNode;
      CSE.boxItem=iterElem;
      }
    iterElem=CSE.boxItem;
    if (CSE.boxItem&&(CSE.boxItem.hasbox==1))  {
      LBE=CBE;
      CBE=iterElem;
      if (CBE!=LBE) {
        applyStyles();
        if (!CBE.requireclick)
          if (CBE.fade) {
            if (ID!=null)
              clearTimeout(ID);
            ID=setTimeout("fadeIn("+CBE.fadespeed+")",CBE.delay);
          }
          else {
            if (ID!=null)
              clearTimeout(ID);
            COL=1;
            ID=setTimeout("oDv.style.visibility='visible';ifCover.style.visibility='visible';ID=null;",CBE.delay); //[RD][AH]
          }
        if (CBE.IEbugfix) {hideSelects();}
        fixposx=!isNaN(CBE.fixX)?Left(CBE)+CBE.fixX:CBE.absX;
        fixposy=!isNaN(CBE.fixY)?Top(CBE)+CBE.fixY:CBE.absY;
        lockX=0;
        lockY=0;
        boxMove=true;
        ox=CBE.offX?CBE.offX:10;
        oy=CBE.offY?CBE.offY:10;
      }
    }
    else if (!isChild(CSE,dvHdr) && !isChild(CSE,dvBdy) && (boxMove)) {
      // The conditional here fixes flickering between tables cells.
      if ((!isChild(CBE,CSE)) || (CSE.tagName!='TABLE')) {
        CBE=null;
        if (ID!=null)
            clearTimeout(ID);
        fadeOut();
        showSelects();
      }
    }
    LSE=CSE;
  }
  else if (((isChild(CSE,dvHdr) || isChild(CSE,dvBdy))&&(boxMove))) {
    totalScrollLeft=0;
    totalScrollTop=0;

    iterElem=CSE;
    while(iterElem) {
      if(!isNaN(parseInt(iterElem.scrollTop)))
        totalScrollTop+=parseInt(iterElem.scrollTop);
      if(!isNaN(parseInt(iterElem.scrollLeft)))
        totalScrollLeft+=parseInt(iterElem.scrollLeft);
      iterElem=iterElem.parentNode;
    }
    if (CBE!=null) {
      boxLeft=Left(CBE)-totalScrollLeft;
      boxRight=parseInt(Left(CBE)+CBE.offsetWidth)-totalScrollLeft;
      boxTop=Top(CBE)-totalScrollTop;
      boxBottom=parseInt(Top(CBE)+CBE.offsetHeight)-totalScrollTop;
      doCheck();
    }
  }

  if (boxMove&&CBE) {
    // This added to alleviate bug in IE6 w.r.t DOCTYPE
    bodyScrollTop=document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
    bodyScrollLet=document.documentElement&&document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft;
    mouseX=evt.pageX?evt.pageX-bodyScrollLet:evt.clientX-document.body.clientLeft;
    mouseY=evt.pageY?evt.pageY-bodyScrollTop:evt.clientY-document.body.clientTop;
    if ((CBE)&&(CBE.windowLock)) {
      mouseY < -oy?lockY=-mouseY-oy:lockY=0;
      mouseX < -ox?lockX=-mouseX-ox:lockX=0;
      mouseY > (SHW()[1]-oDv.offsetHeight-oy)?lockY=-mouseY+SHW()[1]-oDv.offsetHeight-oy:lockY=lockY;
      mouseX > (SHW()[0]-dvBdy.offsetWidth-ox)?lockX=-mouseX-ox+SHW()[0]-dvBdy.offsetWidth:lockX=lockX;
    }
    oDv.style.left=((fixposx)||(fixposx==0))?fixposx:bodyScrollLet+mouseX+ox+lockX+"px";
    oDv.style.top=((fixposy)||(fixposy==0))?fixposy:bodyScrollTop+mouseY+oy+lockY+"px";

    //[RD] Match position and dimensions
    ifCover.style.left = oDv.offsetLeft + 'px';
    ifCover.style.top = oDv.offsetTop + 'px';
    ifCover.style.width = oDv.offsetWidth + 'px';
    ifCover.style.height = oDv.offsetHeight + 'px';
  }
}

function doCheck() {
  if ((mouseX < boxLeft) || (mouseX >boxRight) || (mouseY < boxTop) || (mouseY > boxBottom)) {
    if(!CBE.requireclick) fadeOut();
    if (CBE.IEbugfix) showSelects();
    CBE=null;
  }
}

function pauseBox(e) {
  e?evt=e:evt=event;
  boxMove=false;
  evt.cancelBubble=true;
}

function showHideBox(e) {
  // oDv.style.visibility=(oDv.style.visibility!='visible')?'visible':'hidden';
  //[RD] Expanded ternary operator
  if (oDv.style.visibility == 'visible') {
    //ifCover.style.display = 'none';//[RD]
    ifCover.style.visibility = 'hidden'; //[AH]
    oDv.style.visibility = 'hidden';
  }
  else {
    oDv.style.visibility = 'visible';
    //ifCover.style.display = 'block';//[RD]
    ifCover.style.visibility = 'visible'; //[AH]
  }
}

function hideBox(e) {
  //ifCover.style.display = 'none';//[RD]
  ifCover.style.visibility='hidden'; //[AH]
  oDv.style.visibility='hidden';
}

//[AH] clickoff - stop box from appearing if there's a delay, and/or turn it off.
function clickOff(e) {
  if(ID!=null) { clearTimeout(ID); ID=null; }
  hideBox(e);
}

var COL=0;
var stopfade=false;
function fadeIn(fs) {
  ID=null;
  COL=0;
  oDv.style.visibility='visible';
  ifCover.style.visibility='visible'; //[AH]
  fadeIn2(fs);
}

function fadeIn2(fs) {
  COL=COL+fs;
  COL=(COL>1)?1:COL;
  oDv.style.filter='alpha(opacity='+parseInt(100*COL)+')';
  oDv.style.opacity=COL;
  ifCover.style.filter='alpha(opacity='+parseInt(100*COL)+')'; //[AH]
  ifCover.style.opacity=COL; //[AH]
  if (COL<1)
    setTimeout("fadeIn2("+fs+")",20);
/*
  //[AH] the following isn't needed anymore
  else
    ifCover.style.display = 'block'; //[RD]
*/
}

function fadeOut() {
  //ifCover.style.display = 'none';//[RD]
  ifCover.style.visibility='hidden'; //[AH]
  oDv.style.visibility='hidden';
}

function isChild(s,d) {
  while(s) {
    if (s==d) return true;
    s = s.parentNode;
  }
  return false;
}

var cSrc;
function checkMove(e) {
  e?evt=e:evt=event;
  cSrc=evt.target?evt.target:evt.srcElement;
  if ((!boxMove)&&(!isChild(cSrc,oDv))) {
    fadeOut();
    if (CBE&&CBE.IEbugfix) {showSelects();}
    boxMove=true;
    CBE=null;
  }
}

function showSelects(){
  var elements = document.getElementsByTagName("select");
  for (i=0;i< elements.length;i++){
    elements[i].style.visibility='visible';
  }
}

function hideSelects(){
  var elements = document.getElementsByTagName("select");
  for (i=0;i< elements.length;i++){
    elements[i].style.visibility='hidden';
  }
}