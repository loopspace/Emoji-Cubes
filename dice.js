function init() {
    const urlParams = new URLSearchParams(window.location.search);
//    const urlParams = new URLSearchParams(window.location.hash);
    const myParam = urlParams.get('symbols');
    if (myParam == null) {
	var gendiv = document.getElementById("generate");
	gendiv.classList.remove("invisible");
	var genbtn = document.getElementById("generatebtn");
	genbtn.addEventListener("click", generateUrl);
    } else {
	var symbols = myParam.split("--");
	var ndice = urlParams.get('number');
	if (ndice == null || ndice > symbols.length) ndice = symbols.length;
	setDice(symbols,ndice);
	var reload = document.getElementById("reload");
	reload.classList.remove("invisible");
	reload.addEventListener("click", function() {setDice(symbols, ndice)});
    }
}

function setDice(symbols, ndice) {
    var dicediv = document.getElementById("dicediv");
    dicediv.innerHTML = '';
    var dice, dspan, etext, ucode;
    shuffle(symbols);
    var emoji, rn;
    for (var i = 0; i < ndice; i++) {
	dice = document.createElement("div");
	dspan = document.createElement("span");
	emoji = symbols[i].split("-");
	emoji = emoji.map(function(c) {return String.fromCodePoint(parseInt(c,16))});
	etext = document.createTextNode(emoji.join(""));
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
    var qs = "?";
    qs += "number=" + ndice.value + "&symbols=";
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
    var urlsp = document.getElementById("url");
    urlsp.setAttribute("href", window.location + qs);
    urlsp.innerHTML = window.location + qs;
}

window.addEventListener("load", init);

function shuffle(a) {
    var j;
    for (var i = a.length - 1; i > 0; i--) {
	j = Math.floor(Math.random()*i);
	if (i != j) {
	    [a[i], a[j]] = [a[j], a[i]];
	}
    }
}
