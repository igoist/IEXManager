import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Main from './common';

const mainF = () => {
  if (true) {
    let div = document.getElementById('et-exm-popup-root');

    ReactDOM.render(<Main />, div);
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
