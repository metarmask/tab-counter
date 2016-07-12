/* global chrome */
"use strict";
const buttonSave = document.querySelector("#button-save");

/* Populate the options object with info about the options in the DOM */
const options = {};
document.querySelectorAll(".option").forEach(optionElement => {
	const optionObject = {};
	const optionName = optionElement.id.substr("#option-".length - 1);
	console.log(optionName);
	options[optionName] = optionObject;
	optionObject.element = optionElement;
	optionObject.default = optionElement.value;
	optionObject.modified = false;
	optionObject.savedValue = localStorage["option_" + optionName];
	if(optionObject.savedValue === undefined){
		optionObject.savedValue = optionObject.default;
	}else{
		optionElement.value = optionObject.savedValue;
	}

	optionElement.addEventListener("input", () => {
		const modifiedNow = optionElement.value !== optionObject.savedValue;
		if(optionObject.modified !== modifiedNow){
			optionObject.modified = modifiedNow;
			buttonSave.disabled = !Object.keys(options).some(optionName => options[optionName].modified);
		}
	});
});

/* Save to localStorage and storage.sync and then close the window */
buttonSave.addEventListener("click", () => {
	const toSet = {};
	for(let optionName in options){
		const option = options[optionName];
		if(option.element.value !== option.savedValue){
			toSet["option_" + optionName] = option.element.value;
			localStorage["option_" + optionName] = option.element.value;
			option.savedValue = option.element.value;
			option.modified = false;
		}
	}
	if(Object.keys(toSet).length !== 0){
		buttonSave.disabled = true;
		chrome.storage.sync.set(toSet, () => close());
	}
});
