import { toast } from 'react-toastify';

type ToastPromise = <T>(promise: Promise<T> | (() => Promise<T>), target: string) => Promise<T>;

export default function useToast() {
  const toastInfo = (message: string) => toast.info(message, { className: 'border-b-4 border-[#3498db]' });
  const toastSuccess = (message: string) => toast.success(message, { className: 'border-b-4 border-[#07bc0c]' });
  const toastError = (message: string) => toast.error(message, { className: 'border-b-4 border-[#e74c3c]' });
  const toastWarn = (message: string) => toast.warn(message, { className: 'border-b-4 border-[#f1c40f]' });
  const toastPromise: ToastPromise = (promise, target) => {
    return toast.promise(promise, {
      pending: `${target} 처리 진행중...`,
      success: `${target} 처리 성공`,
      error: `${target} 처리 실패`,
    });
  };

  return { toastInfo, toastSuccess, toastError, toastWarn, toastPromise };
}
