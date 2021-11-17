import * as React from 'react';

import { prefix } from '@Utils';

const ExtensionItem = (props) => {
  const pf = 'et-exm';
  let { ext, enabled, onClick } = props;

  if (ext) {
    return (
      <div className={`${prefix} ${pf}-ex-item ${!enabled ? pf + '-ex-item-disabled' : ''} `} onClick={onClick}>
        <img className={`${prefix} ${pf}-ex-item-icon`} src={ext.icon} />
        <div className={`${prefix} ${pf}-ex-item-name`}>{ext.name}</div>
      </div>
    );
  } else {
    console.log(props);

    return <div>sth wrong</div>;
  }
};

export default ExtensionItem;
