const collections = {
    math: "⁰¹²³⁴⁵⁶⁷⁸⁹¼⅓⅖⅙⅗⅔¾⅕⅘⅐⅞⅑⅜√∝∛≥≤<>+÷±⨉π⊃⊂⋂⋃01234567890",
    faces: "😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔🙃😲☹🙁😖😞😤😢😭😦😧😩🤯😬😰😱🥵🥶😳🤪🥴😠🤬😷🤕🤢🤮🤧😇🥳🤠🤡🤫🤭🧐🤓",
};

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    //	const urlParams = new URLSearchParams(window.location.hash);
    const symbolString = urlParams.get('symbols');
    const collection = urlParams.get('collection');
    if (symbolString == null && !collections.hasOwnProperty(collection)) {
	var gendiv = document.getElementById("generate");
	gendiv.classList.remove("invisible");
	var genbtn = document.getElementById("generatebtn");
	genbtn.addEventListener("click", generateUrl);
    } else {
	var symbols = [];
	if (symbolString != null) {
	    symbols = symbols.concat(paramToList(symbolString));
	}
	if (collections.hasOwnProperty(collection)) {
	    symbols = symbols.concat(_.split(collections[collection],""));		
	}
	var ndice = urlParams.get('number');
	if (ndice == null || ndice > symbols.length) ndice = symbols.length;
	setDice(symbols,ndice);
	var ctrls = document.getElementById("controls");
	ctrls.classList.remove("invisible");
	var reload = document.getElementById("reload");
	reload.addEventListener("click", function(e) {btnAnimate(e.target); setDice(symbols, ndice)});
	var edit = document.getElementById("edit");
	edit.addEventListener("click", function(e) {btnAnimate(e.target); editDice(symbols, ndice)});
    }
}

function paramToList(s) {
    var symbols = s.split("--");
    var list = [];
    var symbol;
    for (var i = 0; i < symbols.length; i++) {
	symbol = symbols[i].split("-");
	symbol = symbol.map(function(c) {return String.fromCodePoint(parseInt(c,16))});
	list.push(symbol.join(""));
    }
    return list;
}

function btnAnimate(btn) {
    btn.parentNode.classList.add("controlAnimate");
    window.setTimeout(function() {btn.parentNode.classList.remove("controlAnimate");},3000);
}

function editDice(symbols, ndice) {
    var emoji = document.getElementById("symbols");
    var ndicediv = document.getElementById("ndice");
    var collection = document.getElementById("collection");
    collection.value = "none";
    ndicediv.value = ndice;
    emoji.value = symbols.join("");
    var gendiv = document.getElementById("generate");
    gendiv.classList.remove("invisible");
    var genbtn = document.getElementById("generatebtn");
    genbtn.addEventListener("click", generateUrl);
    var ctrls = document.getElementById("controls");
    ctrls.classList.add("invisible");
    var dicediv = document.getElementById("dicediv");
    dicediv.innerHTML = '';
}

function setDice(listOfSymbols, ndice) {
    var dicediv = document.getElementById("dicediv");
    dicediv.innerHTML = '';
    var dice, dspan, etext, ucode;
    symbols = shuffle(listOfSymbols);
    var emoji, rn;
    for (var i = 0; i < ndice; i++) {
	dice = document.createElement("div");
	dspan = document.createElement("span");
	etext = document.createTextNode(symbols[i]);
	dspan.append(etext);
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
}

function generateUrl() {
    var emoji = document.getElementById("symbols");
    var ndice = document.getElementById("ndice");
    var collection = document.getElementById("collection");
    var qs = "?";
    qs += "number=" + ndice.value;
    var estring = emoji.value;
    if (collection.value != "none") {
	qs += "&collection=" + collection.value;
    } 
    if (estring != "") {
	qs += "&symbols=";
	var symbols = _.split(emoji.value, "");
	var symbol;
	var codepts = [];
	for (var i = 0; i < symbols.length; i++) {
	    symbol = [];
	    for (let cp of symbols[i]) {		
		symbol.push(cp.codePointAt(0).toString(16));
	    }
	    codepts.push(symbol.join("-"));
	}
	qs += codepts.join("--");
    }
    var urlsp = document.getElementById("url");
    urlsp.setAttribute("href", window.location.pathname + qs);
    urlsp.innerHTML = window.location.pathname + qs;
}

window.addEventListener("load", init);

function shuffle(b) {
    var a = [];
    for (var i = 0; i < b.length; i++) {
	a.push(b[i]);
    }
    var j;
    for (var i = a.length - 1; i > 0; i--) {
	j = Math.floor(Math.random()*i);
	if (i != j) {
	    [a[i], a[j]] = [a[j], a[i]];
	}
    }
    return a;
}
