// 涉及到状态的一些方法直接定义在这里 props => fns
export const backgroundFnsInit = (props) => {
  const { exId, extensionHashs, extensionIndexes, snapshotStore, currentSnapshot } = props;

  // 获取所有已安装的扩展
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

  // 根据是否 enabled 将得到的 extensions 进行归类
  const handleExtensions = (extensions) => {
    for (let ext of extensions) {
      let { id, enabled } = ext;
      extensionHashs[id] = ext;
      extensionIndexes.push(id);
      let abled = enabled ? currentSnapshot.enabled : currentSnapshot.disabled;
      abled.push(id);
    }
  };

  // 同步扩展程序的启用/禁用变更到当前快照
  const syncExtensionStateToCurrentSnapshot = (id, state) => {
    let { enabled, disabled } = currentSnapshot;

    if (state) {
      // 启用
      exchange(id, disabled, enabled, extensionIndexes);
    } else {
      exchange(id, enabled, disabled, extensionIndexes);
    }
  };

  // 批量启用/禁用扩展
  const extensionsStateUpdate = (indexes, enabled) => {
    for (let id of indexes) {
      // 确保扩展程序存在
      if (extensionIndexes.indexOf(id) > -1) {
        chrome.management.setEnabled(id, enabled);
        // 同步扩展的状态变更到当前快照中
        syncExtensionStateToCurrentSnapshot(id, enabled);
      }
    }
  };

  function snapshotApply(name) {
    let foundIndex = snapshotStore.findIndex((snapshot) => snapshot.name === name);

    if (foundIndex === -1) {
      return;
    }

    if (name !== 'last') {
      // backup
      snapshotStore[2].enabled = currentSnapshot.enabled.slice();
      snapshotStore[2].disabled = currentSnapshot.disabled.slice();
    }

    let { enabled, disabled } = snapshotStore[foundIndex];
    extensionsStateUpdate(enabled, true);
    extensionsStateUpdate(disabled, false);
  }

  return {
    fetchExtensions,
    handleExtensions,
    syncExtensionStateToCurrentSnapshot,
    extensionsStateUpdate,
    snapshotApply,
  };
};

// 仅选取需要的字段
export const pruneExtensionObject = (extension) => {
  const { enabled, name, id, optionsUrl, icons } = extension;
  const icon = icons && icons[0];

  if (icon === undefined) {
    console.log(`${name}'s icon x is undefined`, icons);
  }

  return {
    enabled,
    name,
    icon: icon && icon.url,
    id,
    optionsUrl,
  };
};

// 从一个集合中移动一个元素到另一个集合，并保证顺序
export const exchange = (ele, srcColl, dstColl, sortRef) => {
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
};
