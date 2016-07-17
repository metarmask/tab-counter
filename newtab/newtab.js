/* global Odometer */
"use strict";
const odometerOptions = {auto: false};
const tabsOpened = parseInt(localStorage.tabsOpened);
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
	color: ${localStorage.option_textColor};
	background-color: ${localStorage.option_backgroundColor};
	background-image: url("${localStorage.backgroundImageURL}");
	background-repeat: ${localStorage.option_backgroundRepeat === "true"? "repeat" : "no-repeat"};
	background-size: ${localStorage.option_backgroundSize};
}`;
document.head.appendChild(friendlyStyle);

const customStyle = document.createElement("style");
customStyle.textContent = localStorage.option_style;
document.head.appendChild(customStyle);
