// Background service worker.
//
// Chrome auto-downloads local .csv/.tsv files instead of displaying them, so
// the content script never gets a chance to run. Here we catch those download
// events, cancel them, and reopen the file in the extension's viewer page.

export {}; // mark as a module (service worker is "type": "module")

chrome.downloads.onCreated.addListener((item) => {
  const url = item.finalUrl || item.url || '';
  if (!/^file:\/\//i.test(url)) return;        // only local files
  if (!/\.(csv|tsv)$/i.test(url)) return;       // only the formats Chrome downloads

  chrome.downloads.cancel(item.id)
    .then(() => chrome.downloads.erase({ id: item.id }))
    .catch(() => { /* download may already be gone */ });

  const viewer = chrome.runtime.getURL('viewer.html') + '?src=' + encodeURIComponent(url);
  chrome.tabs.create({ url: viewer });
});
