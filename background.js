/* global chrome */
"use strict";
chrome.runtime.onInstalled.addListener(details => {
	if(details.reason === "install"){
		localStorage.tabsOpened = 0;
		localStorage.ready = "true";
	}else if(details.reason === "update"){
		chrome.storage.sync.get("tabsOpened", ({tabsOpened = 0}) => {
			localStorage.tabsOpened = tabsOpened;
			localStorage.ready = "true";
		});
	}
});

chrome.tabs.onCreated.addListener(tab => {
	if(localStorage.ready){
		localStorage.tabsOpened = parseInt(localStorage.tabsOpened) + 1;
		chrome.storage.sync.set({tabsOpened: parseInt(localStorage.tabsOpened)});
	}
});

chrome.storage.onChanged.addListener((changes, area) => {
	console.log(changes);
	if(area === "sync"){
		Object.keys(changes).forEach(property => localStorage[property] = JSON.stringify(changes[property].newValue));
	}
});
