/* global chrome */
"use strict";
chrome.runtime.onInstalled.addListener(details => {
	if(details.reason === "install"){
		localStorage.tabsOpened = 0;
	}
});

chrome.tabs.onCreated.addListener(tab => {
	localStorage.tabsOpened = parseInt(localStorage.tabsOpened) + 1;
	chrome.storage.sync.set({tabsOpened: parseInt(localStorage.tabsOpened)});
});

chrome.storage.onChanged.addListener((changes, area) => {
	console.log(changes);
	if(area === "sync"){
		if("tabsOpened" in changes){
			localStorage.tabsOpened = changes.tabsOpened.newValue;
		}else if("style" in changes){
			localStorage.style = changes.style.newValue;
		}
	}
});

const style = document.createElement("style");
style.textContent = localStorage.style;
document.documentElement.appendChild(style);