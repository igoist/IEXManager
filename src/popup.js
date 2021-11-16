import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from '@Models';

const mainF = () => {
  const pf = 'et';

  const R = () => {
    return <>Hello Popup</>;
  };

  if (true) {
    ReactDOM.render(
      <Provider>
        <R />
      </Provider>,
      document.getElementById(`${pf}-popup-root`)
    );
  }
};

try {
  mainF();
} catch (err) {
  console.log(`%cmainF catch%c: ${err}`, 'background: #fff; color:  #f49cec;', 'color: #149cec;', err);
}
