var tabs = {};

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

chrome.tabs.onRemoved.addListener(function(tabId) {
  delete tabs[tabId];
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
