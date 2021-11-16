export const theme = (type) => {
  switch (type) {
    case 'pink':
      return '#f49cec';
    case 'green':
      return 'green';
    case 'blue':
      return '#149cec';
    case '':
      return '#149cec';
    default:
      return type;
  }
};
