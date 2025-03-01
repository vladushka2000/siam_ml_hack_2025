import { useEffect, useState } from 'react';
import { createSSEClient } from '../sse';
import { backendDSN } from '../../../settings/settings';

export const useSSE = (url: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<any | null>(null);

  useEffect(() => {
    const fullUrl = `${backendDSN()}${url}`;
    const sseClient = createSSEClient(fullUrl);

    const handleMessage = (data: any) => {
      if (data) {
        setMessages((prevMessages) => [...prevMessages, data]);
        setLastMessage(data);
      }
    };

    const handleError = (error: any) => {
      console.error("Ошибка SSE:", error);
    };

    sseClient.connect(handleMessage, handleError);

    return () => {
      sseClient.disconnect();
    };
  }, [url]);

  return { messages, lastMessage };
};
