(async () => {
  const exId = chrome.runtime.id;

  // 当前扩展程序的状态快照
  let currentSnapshot = {
    enabled: [], // 启用组
    disabled: [], // 禁用组
  };

  window.i18n = function (name) {
    return chrome.i18n.getMessage(name);
  };

  console.log('=======================');
  console.log(i18n('background_snapshot_none'));
  console.log(i18n('background_snapshot_all'));
  console.log(i18n('background_snapshot_last'));
  console.log('=======================');

  // CHROME 已安装的扩展程序
  let extensionHashs = {};

  // 扩展程序 ID 索引, 主要用来排序
  let extensionIndexes = [];

  // 内置快照列表，用户无法创建名称与会此产生冲突的快照
  const SNAPSHOT_NONE = 'none'; // 用于一键禁用所以扩展
  const SNAPSHOT_ALL = 'all'; // 用于一键禁用所以扩展
  const SNAPSHOT_LAST = 'last'; // 保存执行快照操作前的快照, 以便还原

  // const BUILDIN_SNAPSHOT_NAMES = [SNAPSHOT_NONE, SNAPSHOT_ALL, SNAPSHOT_LAST];

  // 快照库，用户能自由的添加删除, 会实时同步到 sync storage 中
  let snapshotStore = [
    { name: SNAPSHOT_NONE, builtin: true, title: i18n('background_snapshot_none'), enabled: [], disabled: extensionIndexes },
    { name: SNAPSHOT_ALL, builtin: true, title: i18n('background_snapshot_all'), enabled: extensionIndexes, disabled: [] },
    { name: SNAPSHOT_LAST, builtin: true, title: i18n('background_snapshot_last'), enabled: [], disabled: [] },
  ];

  // 获取所以安装的扩展
  const fetchExtensions = (fn) => {
    return new Promise((resolve) => {
      chrome.management.getAll((extensions) => {
        let exts = extensions
          .filter((extension) => extension.type === 'extension' && extension.id !== exId)
          .map((extension) => {
            return fn(extension);
          });
        resolve(exts);
      });
    });
  };

  // 仅选取需要的字段
  const pruneExtensionObject = (extension) => {
    const { enabled, name, id, optionsUrl, icons } = extension;
    const icon = icons && icons[0];

    if (icon === undefined) {
      console.log(`${name}'s icon is undefined`, icons);
    }

    return {
      enabled,
      name,
      icon: icon && icon.url,
      id,
      optionsUrl,
    };
  };

  // 根据是否 enabled 将得到的 extensions 进行归类
  const handleExtensions = (extensions) => {
    for (let ext of extensions) {
      let { id, enabled } = ext;
      extensionIndexes.push(id);
      extensionHashs[id] = ext;
      let abled = enabled ? currentSnapshot.enabled : currentSnapshot.disabled;
      abled.push(id);
    }
  };

  await fetchExtensions(pruneExtensionObject).then(handleExtensions);

  // loadSnapshotStore();

  // console.log(currentSnapshot.enabled);
  // console.log(currentSnapshot.disabled);

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    const { action, payload } = request;
    try {
      switch (action) {
        case 'initStore':
          sendResponse({
            ok: true,
            data: {
              extensionHashs,
              currentSnapshot,
              snapshotStore,
            },
          });
          return true;
        case 'updateExtensionsState':
          updateExtensionsState(payload.indexes, payload.enabled);
          sendResponse({
            ok: true,
            data: {
              currentSnapshot,
            },
          });
          return true;
      }
    } catch (e) {
      sendResponse({ err: e.message });
      return true;
    }
  });

  // ======================== fns
  // 批量启用/禁用扩展
  function updateExtensionsState(indexes, enabled) {
    for (let id of indexes) {
      // 确保扩展程序存在
      if (extensionIndexes.indexOf(id) > -1) {
        chrome.management.setEnabled(id, enabled);
        // 同步扩展的状态变更到当前快照中
        syncExtensionStateToCurrentSnapshot(id, enabled);
      }
    }
  }

  // 同步扩展程序的启用/禁用变更到当前快照
  function syncExtensionStateToCurrentSnapshot(id, state) {
    let { enabled, disabled } = currentSnapshot;

    if (state) {
      // 启用
      exchange(id, disabled, enabled, extensionIndexes);
    } else {
      exchange(id, enabled, disabled, extensionIndexes);
    }
  }

  // 从一个集合中移动一个元素到另一个集合，并保证顺序
  function exchange(ele, srcColl, dstColl, sortRef) {
    let index = srcColl.indexOf(ele);
    if (index === -1) {
      return;
    }
    srcColl.splice(index, 1);

    let refIndexEle = sortRef.indexOf(ele);
    if (refIndexEle === -1) {
      dstColl.push(ele);
      return;
    }
    let insertIndex;
    for (insertIndex = 0; insertIndex < dstColl.length; insertIndex++) {
      let item = dstColl[insertIndex];
      let refIndexItem = sortRef.indexOf(item);
      if (refIndexItem < refIndexEle) {
        continue;
      }
      break;
    }
    dstColl.splice(insertIndex, 0, ele);
  }
  // ======================== fns
})();
