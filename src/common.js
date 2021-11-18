import * as React from 'react';

import { prefix } from '@Utils';
import { Provider, useIEXManagerHook } from '@Models';
import { ExtensionItem } from '@Components';

const pf = 'et-exm';

const R = () => {
  const { currentSnapshot, extensionHashs, snapshotStore, dispatch } = useIEXManagerHook.useContainer();

  console.log(`here render ================= ${currentSnapshot.enabled.length} - ${currentSnapshot.disabled.length}`);

  if (currentSnapshot.enabled.length + currentSnapshot.disabled.length > 0) {
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
                    <div className={`${prefix} ${pf}-snapshot-item-btns`}>
                      <div
                        className={`${prefix} ${pf}-snapshot-item-btn ${pf}-snapshot-item-btn-apply`}
                        onClick={() =>
                          dispatch({
                            type: 'snapshotApply',
                            payload: {
                              name,
                            },
                          })
                        }
                      >
                        A
                      </div>
                    </div>
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
                        type: 'extensionsStateUpdate',
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
                        type: 'extensionsStateUpdate',
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

export default () => (
  <Provider>
    <R />
  </Provider>
);
