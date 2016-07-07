/* global chrome */
"use strict";
const optionElements = {
	style: document.querySelector("#option-style")
};
{
	const optionsElementList = document.querySelectorAll(".option");
	for(let i = 0;i < optionsElementList.length;i++){
		optionElements[optionsElementList[i].id.substr(7)] = optionsElementList[i];
	}
}

if(!localStorage.style){
	optionElements.style.value = "" +
`body {
	background: green;
}

#number {
	font-size: 10rem;
}`;
}else{
	optionElements.style.value = localStorage.style;
}

document.querySelector("#button-save").addEventListener("click", function(){
	console.log("Save!");
	chrome.storage.sync.set({
		style: optionElements.style.value
	}, () => close());
});