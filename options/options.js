/* global chrome, storage, DOMException */
"use strict";
const saveButton = document.querySelector("#save-button");
const saveStatus = document.querySelector("#save-status");
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
				saveButton.disabled = !Object.keys(options).some(optionName => options[optionName].modified);
			}
		});
		const noneOption = this.element.parentElement.querySelector(".option-none");
		if(noneOption !== null){
			noneOption.addEventListener("click", () => {
				this.value = "none";
				this.element.dispatchEvent(new Event("change"));
			});
		}
	}

	get value() {
		if(this.type === "checkbox"){
			return this.element.checked;
		}else if(this.type === "file"){
			/*
				It's not possible to set the value of an input[type=file].
				Value saving is done seperatley and is not saved to storage.sync.
				The value of an input[type=file] option is "not set" by default,
				the path of the file when set and "none" when the user clicks the
				none button.
			*/
			if(this.element.files.length > 0){
				return this.element.value;
			}else{
				return this._value;
			}
		}else{
			return this.element.value;
		}
	}

	set value(value) {
		if(this.type === "checkbox"){
			return this.element.checked = value;
		}else if(this.type === "file"){
			return this._value = value;
		}else{
			return this.element.value = value;
		}
	}

	get savedValue() {
		console.log(this.name);
		if(this.type === "file"){
			return "not set";
		}else if("_savedValue" in this){
			return this._savedValue;
		}else{
			this._savedValue = storage[this.name];
			return this._savedValue;
		}
	}

	set savedValue(value) {
		if(this.type === "file"){
			return true;
		}
		this._savedValue = value;
		return storage[this.name] = value;
	}
}
document.querySelectorAll(".option").forEach(optionElement => options[optionElement.id] = new Option(optionElement));

/* Save to storage and storage.sync and then close the window */
saveButton.addEventListener("click", () => {
	let asyncsStarted = 0;
	let asyncsFinished = 0;
	let onAsyncFinished;
	const toSet = {};
	for(let optionName in options){
		const option = options[optionName];
		if(option.modified){
			if(option.type === "file" && option.value !== "not set"){
				if(option.value === "none"){
					storage.backgroundImageURL = "";
				}else{
					const fileReader = new FileReader();
					fileReader.addEventListener("load", () => {
						try {
							storage.backgroundImageURL = fileReader.result;
							asyncsFinished++ & onAsyncFinished();
						}catch(error){
							console.debug("reached catch");
							if(error instanceof DOMException){
								console.warn("Image doesn't fit in storage");
								alert("Image doesn't fit in storage.");
							}
						}
					});
					asyncsStarted++;
					fileReader.readAsDataURL(option.element.files[0]);
				}
			}
			toSet[optionName] = option.value;
			option.savedValue = option.value;
			option.modified = false;
		}
	}

	if(Object.keys(toSet).length !== 0){
		saveButton.disabled = true;
		asyncsStarted++;
		chrome.storage.sync.set(toSet, () => asyncsFinished++ & onAsyncFinished());
	}

	saveStatus.classList.remove("save-status-important");
	saveStatus.textContent = "Saving";
	onAsyncFinished = () => {
		if(asyncsStarted === asyncsFinished){
			saveStatus.textContent = "";
		}
	};
});

options.option_preset.value = "none";
options.option_preset.element.addEventListener("input", () => {
	fetch("../newtab/presets/" + options.option_preset.value)
	.then(response => response.text())
	.then(text => {
		options.option_style.value = text;
		options.option_style.element.dispatchEvent(new Event("input"));
		options.option_preset.value = "none";
	});
});

addEventListener("keydown", event => {
	if(event.ctrlKey && event.key === "s"){
		saveButton.click();
		event.preventDefault();
	}
});

addEventListener("mouseout", event => {
	if(event.target === document.documentElement && !saveButton.disabled){
		saveStatus.classList.add("save-status-important");
		saveStatus.textContent = "Not saved";
	}
});
