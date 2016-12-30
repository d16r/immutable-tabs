var tabs = {};

function replaceTabId(oldTabId, newTabId) {
  var tab = tabs[removedTabId];
  tabs[addedTabId] = tab;
  delete tabs[removedTabId];
}

chrome.tabs.query({ pinned: true }, function(results) {
  results.forEach(function(tab) {
    tabs[tab.id] = tab;
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.pinned) {
    tabs[tabId] = tab;
  } else {
    delete tabs[tabId];
  }
});

chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId) {
  replaceTabId(removedTabId, addedTabId);
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  delete tabs[tabId];
});

chrome.webNavigation.onTabReplaced.addListener(function(details) {
  replaceTabId(details.tabId, details.replacedTabId);
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
  var tab = tabs[details.tabId];
  if (tab !== undefined && tab.pinned) {
    return { redirectUrl: "javascript:" };
  }
}, {
  urls: ["<all_urls>"],
  types: ["main_frame"]
}, ['blocking']);
