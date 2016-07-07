/* global chrome */
"use strict";
const optionStyle = document.querySelector("#option-style");
if(!localStorage.style){
	optionStyle.value = "" +
`body {
	background: green;
}

#number {
	font-size: 10rem;
}`;
}else{
	optionStyle.value = localStorage.style;
}

document.querySelector("#button-save").addEventListener("click", function(){
	chrome.storage.sync.set({
		style: optionStyle.value
	}, () => close());
});