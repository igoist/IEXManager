import ETMessage from './Message';

const showETMessage = (config) => {
  let { content, duration = 2000, type } = config;

  ETMessage({
    content,
    duration,
    type,
  });
};

const duration = 2000;

ETMessage.success = (content) => {
  ETMessage({
    content,
    duration,
    type: 'success',
  });
};

ETMessage.warn = (content) => {
  ETMessage({
    content,
    duration,
    type: 'warn',
  });
};

ETMessage.error = (content) => {
  ETMessage({
    content,
    duration,
    type: 'error',
  });
};

export default ETMessage;

export { ETMessage, showETMessage };
