/* global chrome */
"use strict";
const storage = new Proxy({}, {
	get: (target, property) => {
		if(localStorage.getItem(property) === null){
			return;
		}
		let parseResult;
		try {
			parseResult = JSON.parse(localStorage.getItem(property));
		}catch(error){
			if(!(error instanceof SyntaxError)){
				throw error;
			}
		}
		console.log(property, parseResult);
		return parseResult;
	},
	set: (target, property, value) => {
		console.log(property, JSON.stringify(value));
		localStorage.setItem(property, JSON.stringify(value));
		return true;
	}
});

const buttonSave = document.querySelector("#button-save");
const options = {};
class Option {
	constructor(element) {
		this.name = element.id;
		this.type = element.type;
		this.element = element;
		this.default = this.value;
		this.modified = false;
		if(this.savedValue !== undefined){
			this.value = this.savedValue;
		}
		this.element.addEventListener((this.type === "file" || this.type === "checkbox"? "change" : "input"), () => {
			const modifiedNow = this.value !== this.savedValue;
			if(this.modified !== modifiedNow){
				this.modified = modifiedNow;
				buttonSave.disabled = !Object.keys(options).some(optionName => options[optionName].modified);
			}
		});
	}

	get value() {
		if(this.type === "checkbox"){
			return this.element.checked;
		}else{
			return this.element.value;
		}
	}

	set value(value) {
		if(this.type === "checkbox"){
			return this.element.checked = value;
		}else{
			return this.element.value = value;
		}
	}

	get savedValue() {
		console.log(this.name);
		if("_savedValue" in this){
			return this._savedValue;
		}else{
			this._savedValue = storage[this.name];
			return this._savedValue;
		}
	}

	set savedValue(value) {
		this._savedValue = value;
		return storage[this.name] = value;
	}
}
document.querySelectorAll(".option").forEach(optionElement => options[optionElement.id] = new Option(optionElement));

/* Save to localStorage and storage.sync and then close the window */
buttonSave.addEventListener("click", () => {
	let asyncsStarted = 0;
	let asyncsFinished = 0;
	let onAsyncFinished;
	const toSet = {};
	for(let optionName in options){
		const option = options[optionName];
		if(option.modified){
			if(option.name === "option_backgroundImage" && option.element.files.length !== 0){
				const fileReader = new FileReader();
				fileReader.addEventListener("load", () => {
					localStorage.backgroundImageURL = fileReader.result;
					asyncsFinished++ & onAsyncFinished();
				});
				asyncsStarted++;
				fileReader.readAsDataURL(option.element.files[0]);
			}
			toSet[optionName] = option.element.value;
			option.savedValue = option.element.value;
			option.modified = false;
		}
	}

	if(Object.keys(toSet).length !== 0){
		buttonSave.disabled = true;
		asyncsStarted++;
		chrome.storage.sync.set(toSet, () => asyncsFinished++ & onAsyncFinished());
	}

	onAsyncFinished = () => {
		if(asyncsStarted === asyncsFinished){
			// close()
		}
	};
});
