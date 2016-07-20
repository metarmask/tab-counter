/* global Odometer, storage */
"use strict";
const odometerOptions = {auto: false};
const tabsOpened = storage.tabsOpened;
const number = new Odometer({
	el: document.querySelector("#number"),
	theme: "minimal",
	format: "d",
	duration: 1000,
	value: (sessionStorage.displayed? parseInt(sessionStorage.displayed) : Math.max(0, tabsOpened - 1))
});

if(!sessionStorage.displayed){
	number.update(tabsOpened);
}

sessionStorage.displayed = tabsOpened;

const friendlyStyle = document.createElement("style");
friendlyStyle.textContent = `
body {
	font-size: ${storage.option_textSize}px;
	color: ${storage.option_textColor};
	background-color: ${storage.option_backgroundColor};
	background-image: url("${storage.backgroundImageURL}");
	background-repeat: ${storage.option_backgroundRepeat? "repeat" : "no-repeat"};
	background-size: ${storage.option_backgroundSize};
}`;
document.head.appendChild(friendlyStyle);

const customStyle = document.createElement("style");
customStyle.textContent = storage.option_style;
document.head.appendChild(customStyle);
