import * as React from 'react';
import { createContainer } from 'unstated-next';
import { extension, log } from '@Utils';

const { useState, useEffect } = React;
const { sendMessage } = extension;
const { l } = log;

const fn = (data, handleData) => {
  sendMessage(data, (res) => {
    if (res.ok) {
      handleData(res.data);
    } else {
      console.log('res.err', res);
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

  useEffect(() => {
    fn(
      {
        action: 'storeInit',
      },
      (data) => {
        l({
          title: 'IEXManager',
          text: 'init should be success',
        });

        setExtensionHashs(data.extensionHashs);
        setSnapshotStore(data.snapshotStore);
        setCurrentSnapshot(data.currentSnapshot);
      }
    );
  }, []);

  useEffect(() => {
    l({
      title: 'IEXManager',
      text: '...test...',
    });
  });

  const dispatch = (action) => {
    // 调试时可以打印下 action 确认首先有没有发起事件
    const { payload } = action;

    switch (action.type) {
      case 'extensionsStateUpdate':
        fn(
          {
            action: 'extensionsStateUpdate',
            payload,
          },
          (data) => {
            setCurrentSnapshot(data.currentSnapshot);
          }
        );
        break;
      case 'snapshotApply':
        fn(
          {
            action: 'snapshotApply',
            payload,
          },
          (data) => {
            console.log('snapshotApply res data', data);
            // setCurrentSnapshot(data.currentSnapshot);
            setSnapshotStore(data.snapshotStore);
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
