export const CE = (eTag) => {
  return document.createElement(eTag);
};

export const Q = (qTag, el) => {
  const t = el ? el : document;

  return t.querySelector(qTag);
};

export const QA = (qTag, el) => {
  const t = el ? el : document;

  return t.querySelectorAll(qTag);
};

export const hasClass = (className, el) => {
  if (el) {
    return el.className.indexOf(className) !== -1;
  }

  return false;
};

export const addClass = (className, el) => {
  if (el) {
    el.classList.add(className);
  }
};

export const removeClass = (className, el) => {
  if (el) {
    el.classList.remove(className);
  }
};

export const toggleClass = (className, el) => {
  if (el) {
    if (hasClass(className, el)) {
      removeClass(className, el);
    } else {
      addClass(className, el);
    }
  }
};

export const ETElHide = function (el) {
  if (el) {
    el.style.display = 'none';
  }
};

export const ETElShow = function (el) {
  if (el) {
    el.style.display = 'block';
  }
};

/**
 * el
 * name: string    'fade' | 'slide-up'
 * isEnter?: boolean
 * callback?: () => {}
 */
export const ETAnimation = (config) => {
  // tmp prefix
  const prefix = 'et';

  const { el, name, isEnter = false, callback } = config;

  const suffix = isEnter ? 'enter' : 'leave';

  const pf = `${prefix}-${name}-${suffix}`;

  // 避免冲突
  if (hasClass(`${pf}`, el)) {
    return;
  }

  const handleFade = () => {
    el.classList.remove(`${pf}`);
    el.classList.remove(`${pf}-active`);
    el.removeEventListener('animationend', handleFade);

    if (callback) {
      callback();
    }
  };

  el.addEventListener('animationend', handleFade);
  el.classList.add(`${pf}`);
  el.classList.add(`${pf}-active`);
};

export const ETFade = (config) => {
  config.name = 'fade';

  ETAnimation(config);
};

export const ETSlideUP = (config) => {
  config.name = 'slide-up';

  ETAnimation(config);
};

export const htmlToElement = (html) => {
  let template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
};

/**
 * delta: number 偏移值
 * target: dom   定位元素 target
 */
export const scrollSmothlyTo = (delta, target) => {
  // if (!window.requestAnimationFrame) {
  //   window.requestAnimationFrame = (callback, el) => {
  //     return setTimeout(callback, 17);
  //   }
  // }

  let scrollTop;

  if (target) {
    scrollTop = target.scrollTop;
  } else {
    scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  }

  const p = window.scrollY + delta;

  const step = () => {
    const distance = p - scrollTop;

    scrollTop += distance / 5;

    if (Math.abs(distance) < 1) {
      window.scrollTo(0, p);
    } else {
      window.scrollTo(0, scrollTop);
      requestAnimationFrame(step);
    }
  };

  step();
};

import * as log from './log';

export const returnTargetDOM = (array) => {
  let t = null;

  for (let i = 0; i < array.length; i++) {
    let tmp = Q(array[i]);

    if (tmp) {
      log.l({
        title: 'checkMS',
        text: `${array[i]} exist`,
      });

      t = {
        c: array[i],
        d: tmp,
      };

      break;
    }
  }

  return t;
};
