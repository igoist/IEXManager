import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { prefix, dom, log, extension } from '@Utils';
import { Provider, useIEXManagerHook } from '@Models';
import { ExtensionItem } from '@Components';

const { useEffect, useState } = React;
const { addClass } = dom;
const { sendMessage } = extension;
const { l } = log;

const mainF = () => {
  const pf = 'et-exm';

  const R = () => {
    const { currentSnapshot, extensionHashs, snapshotStore, dispatch } = useIEXManagerHook.useContainer();

    useEffect(() => {
      sendMessage(
        {
          action: 'initStore',
        },
        (res) => {
          l({
            title: 'Demo test',
            text: 'should be success',
          });

          console.log('here data', res);

          dispatch({
            type: 'initStore',
            payload: res.data,
          });
        }
      );
    }, []);

    console.log(`here render ================= ${currentSnapshot.enabled.length} - ${currentSnapshot.disabled.length}`);

    if (currentSnapshot.enabled.length && currentSnapshot.disabled.length) {
      return (
        <>
          <div className={`${prefix} ${pf}-wrap`}>
            <div className={`${prefix} ${pf}-title`}>{i18n('popup_title_snapshot')}</div>
            <div className={`${prefix} ${pf}-snapshots`}>
              {snapshotStore
                .filter((snapshot) => {
                  if (snapshot.builtin && snapshot.enabled.length + snapshot.disabled.length === 0) {
                    return false;
                  }
                  return true;
                })
                .map((snapshot) => {
                  let { name, title, builtin } = snapshot;

                  return (
                    <div className={`${prefix} ${pf}-snapshot-item`} key={name}>
                      <span className={`${prefix} ${pf}-snapshot-item-name`}>{title || name}</span>
                      {/* <div className='snapshot-btns'>
                    <button className='btn' onClick={_ => applySnapshot({name})}>
                      <i className='icon icon-apply' />
                    </button>
                    <button className={classNames('btn', {'btn-disabled': builtin})} onClick={_ => removeSnapshot({name})}>
                      <i className='icon icon-del' />
                    </button>
                  </div> */}
                    </div>
                  );
                })}
            </div>

            <div className={`${prefix} ${pf}-title`}>{i18n('popup_title_extension')}</div>
            <div className={`${prefix} ${pf}-exs`}>
              {currentSnapshot.enabled.map((id) => {
                let ext = extensionHashs[id];

                if (ext) {
                  return (
                    <ExtensionItem
                      enabled={true}
                      key={id}
                      ext={ext}
                      onClick={() =>
                        dispatch({
                          type: 'updateExtensionsState',
                          payload: { indexes: [ext.id], enabled: false },
                        })
                      }
                    />
                  );
                } else {
                  console.log('e', id, ext);
                  return null;
                }
              })}
              {currentSnapshot.disabled.map((id) => {
                let ext = extensionHashs[id];
                if (ext) {
                  return (
                    <ExtensionItem
                      enabled={false}
                      key={id}
                      ext={ext}
                      onClick={() =>
                        dispatch({
                          type: 'updateExtensionsState',
                          payload: { indexes: [ext.id], enabled: true },
                        })
                      }
                    />
                  );
                } else {
                  console.log('d', id, ext);
                  return null;
                }
              })}
            </div>
          </div>
        </>
      );
    } else {
      return null;
    }
  };

  if (true) {
    let div = document.createElement('div');
    addClass(`${pf}-root`, div);

    document.body.appendChild(div);

    ReactDOM.render(
      <Provider>
        <R />
      </Provider>,
      div
    );
  }
};

window.i18n = function (name) {
  return chrome.i18n.getMessage(name);
};

try {
  mainF();
} catch (err) {
  console.log(`%cmainF catch%c: ${err}`, 'background: #fff; color:  #f49cec;', 'color: #149cec;', err);
}
