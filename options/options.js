/* global chrome */
"use strict";
const optionStyle = document.querySelector("#option-style");
if(!localStorage.style){
	optionStyle.value = "" +
`body {
	background-color: white;
	background-image: url("http://www.example.com/path/to/image.png");
}

#number {
	font-size: 10rem;
	color: white;
	font-family: sans-serif;
}`;
}else{
	optionStyle.value = localStorage.style;
}

document.querySelector("#button-save").addEventListener("click", function(){
	chrome.storage.sync.set({
		style: optionStyle.value
	}, () => close());
});