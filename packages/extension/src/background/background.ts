// Manifest V3 Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'ttt-open-web',
    title: 'Open Tic Tac Toe Full App',
    contexts: ['action', 'page'],
  });

  chrome.contextMenus.create({
    id: 'ttt-reset-badge',
    title: 'Reset Streak Badge',
    contexts: ['action'],
  });

  // Set initial badge background color
  chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'ttt-open-web') {
    chrome.tabs.create({ url: 'https://tictactoe-pro.netlify.app/' });
  } else if (info.menuItemId === 'ttt-reset-badge') {
    chrome.action.setBadgeText({ text: '' });
  }
});

// Message listener for popup events
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'UPDATE_STREAK') {
    const streak = request.streak || 0;
    if (streak > 0) {
      chrome.action.setBadgeText({ text: streak.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#06b6d4' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
    sendResponse({ success: true });
  }
  return true;
});
