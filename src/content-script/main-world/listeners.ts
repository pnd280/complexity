import { globalStore } from '../session-store/global';
import { webpageMessenger } from './messenger';

function onWebSocketCaptured() {
  webpageMessenger.onMessage('webSocketCaptured', async () => {
    globalStore.setState({ isWebSocketCaptured: true });
  });

  webpageMessenger.onMessage('longPollingCaptured', async () => {
    globalStore.setState({ isLongPollingCaptured: true });
  });
}

const webpageListeners = {
  onWebSocketCaptured,
};

export default webpageListeners;
