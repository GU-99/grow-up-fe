import Timer from '@/components/common/Timer';

type VerificationButtonProps = {
  isVerificationRequested: boolean;
  isTimerVisible: boolean;
  isSubmitting: boolean;
  requestCode: () => void;
  handleTimerTimeout: () => void;
};

export default function VerificationButton({
  isVerificationRequested,
  isTimerVisible,
  isSubmitting,
  requestCode,
  handleTimerTimeout,
}: VerificationButtonProps) {
  return (
    <div className="flex flex-col gap-8 text-center">
      {!isVerificationRequested ? (
        <button
          type="submit"
          className="flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
          onClick={requestCode}
        >
          <span>인증요청</span>
        </button>
      ) : (
        <button
          type="submit"
          className="relative flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
          disabled={isSubmitting}
        >
          {isTimerVisible && (
            <div className="absolute left-10">
              <Timer time={180} onTimeout={handleTimerTimeout} />
            </div>
          )}
          <span>확인</span>
        </button>
      )}
    </div>
  );
}
