import * as fns from './backgroundFns';

const main = async () => {
  const log = console.log.bind(this);

  const { backgroundFnsInit, pruneExtensionObject } = fns;

  const exId = chrome.runtime.id;

  // 当前扩展程序的状态快照
  let currentSnapshot = {
    enabled: [], // 启用组
    disabled: [], // 禁用组
  };

  // ======================== special fns
  window.show = () => {
    log('====================== show start');
    log(commonProps);
    // log(i18n('background_snapshot_none'));
    // log(i18n('background_snapshot_all'));
    // log(i18n('background_snapshot_last'));
    log('====================== show end');
  };
  // ======================== special fns emd

  window.i18n = function (name) {
    return chrome.i18n.getMessage(name);
  };

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

  const commonProps = {
    exId,
    extensionHashs,
    extensionIndexes,
    snapshotStore,
    currentSnapshot,
  };

  const backgroundFns = backgroundFnsInit(commonProps);

  const { fetchExtensions, handleExtensions, extensionsStateUpdate, snapshotApply } = backgroundFns;

  await fetchExtensions(pruneExtensionObject).then(handleExtensions);

  // loadSnapshotStore();

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    const { action, payload } = request;
    try {
      switch (action) {
        case 'storeInit':
          sendResponse({
            ok: true,
            data: {
              extensionHashs,
              currentSnapshot,
              snapshotStore,
            },
          });
          return true;
        case 'extensionsStateUpdate':
          extensionsStateUpdate(payload.indexes, payload.enabled);
          sendResponse({
            ok: true,
            data: {
              currentSnapshot,
            },
          });
          return true;
        case 'snapshotApply':
          console.log('snapshotApply', payload);
          snapshotApply(payload.name);
          sendResponse({
            ok: true,
            data: {
              snapshotStore,
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
};

try {
  main();
} catch (err) {
  console.log('main err', err);
}
