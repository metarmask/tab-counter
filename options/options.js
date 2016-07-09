/* global chrome */
"use strict";
const defaultUserStyle = "" +
`body {

}

#number {

}`;

const buttonSave = document.querySelector("#button-save");
const options = {
	style: {
		savedValue: localStorage.option_style,
		defaultValue: defaultUserStyle,
	},
	textColor: {
		savedValue: localStorage.option_textColor,
		defaultValue: "#ffffff"
	}
};
Object.keys(options).forEach(optionName => options[optionName].element = document.querySelector("#option-" + optionName));
Object.keys(options).forEach(optionName => options[optionName].modified = false);

buttonSave.addEventListener("click", () => {
	const toSet = {};
	for(let optionName in options){
		const option = options[optionName];
		if(option.element.value !== option.savedValue){
			toSet["option_" + optionName] = option.element.value;
			localStorage["option_" + optionName] = option.element.value;
			option.modified = false;
			option.savedValue = option.element.value;
		}
	}
	if(Object.keys(toSet).length !== 0){
		buttonSave.disabled = !Object.keys(options).some(optionName => options[optionName].modified);
		chrome.storage.sync.set(toSet, () => close());
	}
});

Object.keys(options).forEach(optionName => {
	options[optionName].element.addEventListener("input", () => {
		const option = options[optionName];
		const modifiedNow = option.element.value !== option.savedValue;
		if(option.modified !== modifiedNow){
			option.modified = modifiedNow;
			buttonSave.disabled = !Object.keys(options).some(optionName => options[optionName].modified);
		}
	});
});
