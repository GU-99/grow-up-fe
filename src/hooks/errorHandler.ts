import axios from 'axios';

// ToDo: useAxios의 에러 처리와 react query의 에러 처리를 담당하도록 만들 것
export default function errorHandler<T extends Error>(error: T) {
  // ToDo: AxiosError가 아닌 경우 에러 처리
  if (!axios.isAxiosError(error)) return;

  if (error.request) {
    // ToDo: 네트워크 요청을 보냈지만 응답이 없는 경우 에러 처리
  } else if (error.response) {
    // ToDo: 요청후 응답을 받았지만 200 이외의 응답 코드인 경우 예외 처리
  } else {
    // ToDo: request 설정 오류
  }
}
