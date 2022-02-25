/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  console.log('Message in webworker: ', data);
  postMessage(response);
});
