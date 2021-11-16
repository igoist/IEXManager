const decodeUnicode = (str) => {
  str = str.replace(/\\/g, '%');
  return unescape(str);
};

export {
  decodeUnicode
}
