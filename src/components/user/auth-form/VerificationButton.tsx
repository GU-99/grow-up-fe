import Timer from '@/components/common/Timer';

type VerificationButtonProps = {
  isVerificationRequested: boolean;
  isTimerVisible: boolean;
  isSubmitting: boolean;
  requestCode: () => void;
  handleTimerTimeout: () => void;
  buttonLabel: string;
};

export default function VerificationButton({
  isVerificationRequested,
  isTimerVisible,
  isSubmitting,
  requestCode,
  handleTimerTimeout,
  buttonLabel,
}: VerificationButtonProps) {
  return (
    <div className="flex flex-col gap-8 text-center">
      {!isVerificationRequested ? (
        <button
          type="submit"
          className="flex h-25 items-center justify-center rounded-lg bg-sub px-8 font-bold"
          onClick={requestCode}
        >
          <span>인증요청</span>
        </button>
      ) : (
        <button
          type="submit"
          className="relative flex h-25 items-center justify-center rounded-lg bg-sub px-8 font-bold"
          disabled={isSubmitting}
        >
          {isTimerVisible && (
            <div className="absolute left-10">
              <Timer time={180} onTimeout={handleTimerTimeout} />
            </div>
          )}
          <span>{buttonLabel}</span>
        </button>
      )}
    </div>
  );
}
