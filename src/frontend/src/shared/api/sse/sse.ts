type MessageHandler = (data: any) => void;
type ErrorHandler = (error: Event) => void;

export const createSSEClient = (url: string) => {
  let eventSource: EventSource | null = null;

  const connect = (onMessage: MessageHandler, onError?: ErrorHandler) => {
    eventSource = new EventSource(url);

    eventSource.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Ошибка при парсинге JSON:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("Ошибка SSE:", error);

      if (onError) {
        onError(error);
      }
    };
  };

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };

  return {
    connect,
    disconnect,
  };
};
