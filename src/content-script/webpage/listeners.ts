import { globalStore } from '../session-store/global';
import { webpageMessenger } from './messenger';

function onWebSocketCaptured() {
  webpageMessenger.onMessage('websocketCaptured', async () => {
    globalStore.setState({ isReady: true });
  });
}

const webpageListeners = {
  onWebSocketCaptured,
};

export default webpageListeners;
