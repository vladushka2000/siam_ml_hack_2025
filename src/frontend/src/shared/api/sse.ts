import { backendDSN } from "../settings/settings";

export const createSSEClient = () => {
  let eventSource: EventSource | null = null;
  let messageQueue: string[] = [];
  let resolvePromise: ((message: string) => void) | null = null;

  const connect = (url: string): void => {
    if (eventSource) {
      console.log('Already connected to SSE.');
      return;
    }

    const fullUrl = `${backendDSN()}${url}`;
    eventSource = new EventSource(fullUrl);

    eventSource.onmessage = (event: MessageEvent) => {
      const message = event.data;
      console.log('Received message:', message);

      if (resolvePromise) {
        resolvePromise(message);
        resolvePromise = null;
      } else {
        messageQueue.push(message);
      }
    };

    eventSource.onerror = (event: Event) => {
      console.error('SSE error:', event);
      disconnect();
    };

    console.log('Connected to SSE.');
  };

  const disconnect = (): void => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      console.log('Disconnected from SSE.');
    } else {
      console.log('No active SSE connection.');
    }
  };

  const waitForMessage = async (): Promise<string> => {
    if (messageQueue.length > 0) {
      return messageQueue.shift()!;
    }

    return new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });
  };

  return {
    connect,
    disconnect,
    waitForMessage,
  };
};
