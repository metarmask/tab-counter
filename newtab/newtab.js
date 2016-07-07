/* global Odometer */
"use strict";
const odometerOptions = {auto: false};
const tabsOpened = parseInt(localStorage.tabsOpened);
const number = new Odometer({
	el: document.querySelector("#number"),
	theme: "minimal",
	format: "d",
	duration: 1000,
	value: (sessionStorage.displayed? parseInt(sessionStorage.displayed) : tabsOpened - 1)
});

if(!sessionStorage.displayed){
	number.update(tabsOpened);
}

sessionStorage.displayed = tabsOpened;