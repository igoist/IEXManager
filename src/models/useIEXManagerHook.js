import * as React from 'react';
import { createContainer } from 'unstated-next';
// import { extension } from '@Utils';

const { useState, useEffect } = React;
// const { setStore } = extension;

const fn = (data, handleData) => {
  chrome.runtime.sendMessage(data, (res) => {
    if (res.ok) {
      handleData(res.data);
    } else {
      console.log('res.err');
    }
  });
};

const useIEXManagerHook = () => {
  const [currentSnapshot, setCurrentSnapshot] = useState({
    disabled: [],
    enabled: [],
  });
  const [extensionHashs, setExtensionHashs] = useState({});
  const [snapshotStore, setSnapshotStore] = useState([]);

  const dispatch = (action) => {
    const { payload } = action;

    switch (action.type) {
      case 'initStore':
        console.log('DataSet', action.payload);
        setCurrentSnapshot(payload.currentSnapshot);
        setExtensionHashs(payload.extensionHashs);
        setSnapshotStore(payload.snapshotStore);
        break;
      case 'updateExtensionsState':
        fn(
          {
            action: 'updateExtensionsState',
            payload,
          },
          (data) => {
            setCurrentSnapshot(data.currentSnapshot);
          }
        );
        break;
      default:
        break;
    }
  };

  return { currentSnapshot, extensionHashs, snapshotStore, dispatch };
};

export default createContainer(useIEXManagerHook);
