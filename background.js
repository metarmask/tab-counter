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
		Object.keys(changes).forEach(property => localStorage[property] = changes[property].newValue);
	}
});
