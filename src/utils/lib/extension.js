/**
 * chrome.storage 方法 sync、local 的区别：
 * 如果要为您的应用储存用户数据，您可以使用 storage.sync 或 storage.local。使用 storage.sync 时，储存的数据将会自动在用户启用同步功能并已经登录的所有 Chrome 浏览器间同步。
 * 当 Chrome 浏览器处于离线状态时，Chrome 浏览器将数据储存在本地。下一次浏览器在线时，Chrome 浏览器将会同步数据。即使用户关闭了同步，storage.sync 仍然有效，只是此时它与 storage.local 的行为相同。
 * f(browser extension)
 * keyArr as Array<any>
 * keyAndValue as {}
 */
export const getStore = (keyArr, callback) => {
  chrome.storage.sync.get(keyArr, (result) => {
    callback({
      ...result,
    });
  });
};

export const getStoreLocal = (keyArr, callback) => {
  chrome.storage.local.get(keyArr, (result) => {
    callback({
      ...result,
    });
  });
};

export const setStore = (keyAndValue, callback) => {
  chrome.storage.sync.set(keyAndValue, (a, b) => {
    if (callback) {
      callback();
    }
  });
};

export const setStoreLocal = (keyAndValue, callback) => {
  chrome.storage.local.set(keyAndValue, (a, b) => {
    if (callback) {
      callback();
    }
  });
};

export const getOrCreateStorage = (key, defaultValue) => {
  return new Promise((resolve) => {
    getStore([key], (result) => {
      if (result[key]) {
        resolve(result[key]);
      } else {
        resolve(defaultValue);
      }
    });
  });
};

window.getStore = getStore;
window.getStoreLocal = getStoreLocal;
window.setStore = setStore;
window.setStoreLocal = setStoreLocal;
window.getOrCreateStorage = getOrCreateStorage;

export const sendMessage = (data, callback) => {
  chrome.runtime.sendMessage(data, callback);
};

/**
 * ======== bg only ========
 * ETXSenderGetTab
 * ETXTabRemove
 **/
export const ETXSenderGetTab = (sender) => {
  return sender.tab;
};

export const ETXTabRemove = (id, callback) => {
  chrome.tabs.remove(id, callback);
};
