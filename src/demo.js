import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Main from './common';

const { useState, useEffect } = React;

const mainF = () => {
  const pf = 'et-exm';

  const R = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const handle = (e) => {
        if (e.altKey) {
          if (e.keyCode === 69) {
            setVisible(!visible);
          }
        }
      };

      document.body.addEventListener('keydown', handle);
      return () => {
        document.body.removeEventListener('keydown', handle);
      };
    });

    if (visible) {
      return (
        <div className={`${pf}-root`}>
          <Main />
        </div>
      );
    } else {
      return null;
    }
  };

  if (true) {
    let div = document.createElement('div');

    document.body.appendChild(div);

    ReactDOM.render(<R />, div);
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
