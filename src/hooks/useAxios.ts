import { useState, useCallback } from 'react';
import errorHandler from '@hooks/errorHandler';
import type { AxiosResponse } from 'axios';

type PromiseCallback<T, P extends unknown[]> = (...args: P) => Promise<AxiosResponse<T>>;

/**
 * Axios API 함수를 처리하는 커스텀 훅
 *
 * @export
 * @template T - AxiosResponse의 응답 데이터 타입
 * @template {unknown[]} P - API 함수에 전달되는 매개변수의 가변인자 타입 배열
 * @param {PromiseCallback<T, P>} fetchCallback - API 요청을 수행하는 함수
 * @returns {{
 *   data: T | undefined;   // API 요청의 응답 데이터
 *   error: Error | null;   // API 요청 중 발생한 에러
 *   loading: boolean;      // 데이터 로딩 중인지 여부
 *   fetchData: (...args: P) => Promise<void>; // API 요청을 호출하는 함수
 * }}
 * @example
 * const { data, error, loading, fetchData } = useAxios(fetchCallback) // fetchCallback에서 타입을 반환한다면, 자동 타입 추론이 가능
 * const { data, error, loading, fetchData } = useAxios<User[], Parameters<typeof fetchCallback>>(fetchCallback);
 */
export default function useAxios<T, P extends unknown[]>(fetchCallback: PromiseCallback<T, P>) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const clearData = useCallback(() => {
    setData(undefined);
    setError(null);
    setLoading(false);
  }, []);

  const fetchData = useCallback(
    async (...params: P) => {
      try {
        setLoading(true);
        const response = await fetchCallback(...params);
        setData(response.data);
      } catch (error: unknown) {
        setError(error as Error);
        errorHandler(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [fetchCallback],
  );

  return { data, error, loading, clearData, fetchData };
}
