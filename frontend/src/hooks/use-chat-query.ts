import { useState, useCallback } from "react";
import { getMessages } from "@/api/apiController";

interface ChatQueryProps {
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

interface ChatMessage {
  messages: any[];
  nextCursor: string | null;
}

export const useChatQuery = ({
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const [data, setData] = useState<{ pages: ChatMessage[] }>({ pages: [] });
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!hasNextPage || isFetching) return;
    
    setIsFetching(true);
    setIsError(false);

    try {
      const url = `${apiUrl}?${paramKey}=${paramValue}${cursor ? `&cursor=${cursor}` : ''}`;
      const res = await getMessages(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      console.log(json)

      setData(prev => ({
        pages: [
          ...prev.pages,
          {
            messages: json.messages,
            nextCursor: json.nextCursor,
          },
        ],
      }));

      setCursor(json.nextCursor);
      setHasNextPage(!!json.nextCursor);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsError(true);
    } finally {
      setIsFetching(false);
    }
  }, [apiUrl, paramKey, paramValue, cursor, hasNextPage, isFetching]);

  return {
    data,
    fetchMessages,
    hasNextPage,
    isFetching,
    isError,
  };
};