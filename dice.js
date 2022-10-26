const collections = {
    math: "⁰¹²³⁴⁵⁶⁷⁸⁹¼⅓⅖⅙⅗⅔¾⅕⅘⅐⅞⅑⅜√∝∛≥≤<>+÷±⨉π⊃⊂⋂⋃01234567890",
    faces: "😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔🙃😲☹🙁😖😞😤😢😭😦😧😩🤯😬😰😱🥵🥶😳🤪🥴😠🤬😷🤕🤢🤮🤧😇🥳🤠🤡🤫🤭🧐🤓",
};

let promise = Promise.resolve();
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  },
};

// https://stackoverflow.com/q/14644558/315213
function loadScript(scriptUrl) {
  const script = document.createElement('script');
  script.src = scriptUrl;
  document.body.appendChild(script);
  
  return new Promise((res, rej) => {
    script.onload = function() {
      res();
    }
    script.onerror = function () {
      rej();
    }
  });
}

function loadMJ() {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.1.2/es5/tex-chtml.min.js')
	.then(() => {
	    init();
	})
	.catch(() => {

	});
}

window.addEventListener("load", loadMJ);

function init() {
    var urlParams;
    if (window.location.protocol == "file:") {
	urlParams = new URLSearchParams(window.location.hash);
    } else {
	urlParams = new URLSearchParams(window.location.search);
    }
    const symbolString = urlParams.get('symbols');
    const collection = urlParams.get('collection');
    const words = urlParams.get('words');
    if (
	symbolString == null
	    &&
	    words == null
	    &&
	    !collections.hasOwnProperty(collection)
    ) {
	var gendiv = document.getElementById("generate");
	gendiv.classList.remove("invisible");
	var ctnr = document.getElementById("container");
	ctnr.classList.add("invisible");
	var genbtn = document.getElementById("generatebtn");
	genbtn.addEventListener("click", generateUrl);
	promise = promise.then( () => MathJax.typesetPromise(
	    () => document.querySelector(".math")
	));
    } else {

	var eelt = document.getElementById("symbols");
	var nelt = document.getElementById("ndice");
	var celt = document.getElementById("collection");
	var welt = document.getElementById("words");
	var symbols = [];
	if (symbolString != null) {
	    symbols = symbols.concat(_.split(symbolString, ""));
	    eelt.value = symbolString;
	}
	if (collections.hasOwnProperty(collection)) {
	    symbols = symbols.concat(_.split(collections[collection],""));
	    celt.value = collection;
	}
	if (words != null) {
	    var wordlist = words.trim().split(/\s*,\s*/)
	    symbols = symbols.concat(wordlist);
	    welt.value = words;
	}
	var ndice = urlParams.get('number');
	if (ndice == null || ndice > symbols.length) ndice = symbols.length;
	nelt.value = ndice;
	setDice(symbols,ndice)
	var ctrls = document.getElementById("controls");
	ctrls.classList.remove("invisible");
	var reload = document.getElementById("reload");
	reload.addEventListener("click", function(e) {btnAnimate(e.target); setDice(symbols, ndice)});
	var edit = document.getElementById("edit");
	edit.addEventListener("click", function(e) {btnAnimate(e.target); editDice(symbols, ndice)});
    }
}
function btnAnimate(btn) {
    btn.parentNode.classList.add("controlAnimate");
    window.setTimeout(function() {btn.parentNode.classList.remove("controlAnimate");},3000);
}

function editDice(symbols, ndice) {
    var gendiv = document.getElementById("generate");
    gendiv.classList.remove("invisible");
    var genbtn = document.getElementById("generatebtn");
    genbtn.addEventListener("click", generateUrl);
    var ctrls = document.getElementById("controls");
    ctrls.classList.add("invisible");
    var ctnr = document.getElementById("container");
    ctnr.classList.add("invisible");
    var dicediv = document.getElementById("dicediv");
    if (dicediv.hasChildNodes()) {
	dicediv.innerHTML = '';
	MathJax.typesetClear();
    }
    promise = promise.then( () => MathJax.typesetPromise(
	() => document.querySelector(".math")
    ));
}

function setDice(listOfSymbols, ndice) {
    promise = promise.then( () => MathJax.typesetPromise(
	setDiceAux(listOfSymbols, ndice)
    )).catch( (err) => console.log('Typeset failed: ' + err.message));
    return promise;
}

function setDiceAux(listOfSymbols, ndice) {
    var dicediv = document.getElementById("dicediv");
    if (dicediv.hasChildNodes()) {
	dicediv.innerHTML = '';
	MathJax.typesetClear();
    }
    var dice, dspan, etext, ucode, delts;
    symbols = shuffle(listOfSymbols);
    var emoji, rn;
	delts = [];
    for (var i = 0; i < ndice; i++) {
	dice = document.createElement("div");
	dspan = document.createElement("span");
	etext = document.createTextNode(symbols[i]);
	dspan.append(etext);
	delts.push(dspan);
	dice.append(dspan);
	dice.classList.add("dice");
	rn = Math.random();
	if (rn < .25) {
	    dice.classList.add("diceRotatem315Animation");
	} else if (rn < .5) {
	    dice.classList.add("diceRotatem135Animation");
	} else if (rn < .75) {
	    dice.classList.add("diceRotate135Animation");
	} else {
	    dice.classList.add("diceRotate315Animation");
	}
	dice.classList.add("diceAnimate");
	dicediv.append(dice);
    }
	return delts;
}

function generateUrl() {
    var emoji = document.getElementById("symbols");
    var ndice = document.getElementById("ndice");
    var collection = document.getElementById("collection");
	var words = document.getElementById("words");
	var qs;
	if (window.location.protocol == "file:")
	{
		qs = "#stuff&";
	} else {
		qs = "?";
	}
    qs += "number=" + ndice.value;
    if (collection.value != "none") {
		qs += "&collection=" + collection.value;
    }
    if (emoji.value != "") {
		qs += "&symbols=" + encodeURIComponent(emoji.value);
    }
	if (words.value != "") {
		qs += "&words=" + encodeURIComponent(words.value);
	}
    var urlsp = document.getElementById("url");
    urlsp.setAttribute("href", window.location.pathname + qs);
    urlsp.innerHTML = window.location.pathname + qs;
}


function shuffle(b) {
    var a = [];
    for (var i = 0; i < b.length; i++) {
	a.push(b[i]);
    }
    var j;
    for (var i = a.length - 1; i >= 0; i--) {
	j = Math.floor(Math.random()*(i+1));
	if (i != j) {
	    [a[i], a[j]] = [a[j], a[i]];
	}
    }
    return a;
}
