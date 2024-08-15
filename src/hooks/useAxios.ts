import axios from 'axios';
import { useEffect, useState } from 'react';

import type { AxiosResponse } from 'axios';

type PromiseCallback<T, P extends unknown[]> = (signal: AbortSignal, ...params: P) => Promise<AxiosResponse<T>>;

export default function useAxios<T, P extends unknown[]>(fetchCallback: PromiseCallback<T, P>, ...params: P) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);

  // ToDo: 성공/실패 토스트 메세지 출력하기
  useEffect(() => {
    const fetchController = new AbortController();
    const { signal } = fetchController;

    const fetch = async () => {
      try {
        setLoading(true);
        const response = await fetchCallback(signal, ...params);
        setData(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.request) {
            // ToDo: 네트워크 요청을 보냈지만 응답이 없는 경우 에러 처리
          } else if (error.response) {
            // ToDo: 요청후 응답을 받았지만 200 이외의 응답 코드인 경우 예외 처리
          } else {
            // ToDo: 그 외 예외 처리
          }
        }
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };
    fetch();

    return () => {
      fetchController.abort();
    };
  }, [fetchCallback, params]);

  return { data, loading };
}
