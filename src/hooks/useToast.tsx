import { toast } from 'react-toastify';

type ToastPromise = <T>(promise: Promise<T> | (() => Promise<T>), target: string) => Promise<T>;

export default function useToast() {
  const toastInfo = (message: string) => toast.info(message);
  const toastSuccess = (message: string) => toast.success(message);
  const toastError = (message: string) => toast.error(message);
  const toastWarn = (message: string) => toast.warn(message);
  const toastPromise: ToastPromise = (promise, target: string) =>
    toast.promise(promise, {
      pending: `${target} 처리 진행중...`,
      success: `${target} 처리 성공`,
      error: `${target} 처리 실패`,
    });

  return { toastInfo, toastSuccess, toastError, toastWarn, toastPromise };
}
