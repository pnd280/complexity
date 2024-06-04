import { globalStore } from '../session-store/global';
import { webpageMessenger } from './messenger';

function onWebSocketCaptured() {
  webpageMessenger.onMessage('websocketCaptured', async () => {
    globalStore.setState({ isWebsocketCaptured: true });
  });

  webpageMessenger.onMessage('longPollingCaptured', async () => {
    globalStore.setState({ isLongPollingCaptured: true });
  });
}

const webpageListeners = {
  onWebSocketCaptured,
};

export default webpageListeners;
