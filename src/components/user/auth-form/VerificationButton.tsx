import Timer from '@components/common/Timer';

type VerificationButtonProps = {
  isVerificationRequested: boolean;
  isSubmitting: boolean;
  requestCode: () => void;
  expireVerificationCode: () => void;
  buttonLabel: string;
};

export default function VerificationButton({
  isVerificationRequested,
  isSubmitting,
  requestCode,
  expireVerificationCode,
  buttonLabel,
}: VerificationButtonProps) {
  return (
    <div>
      {!isVerificationRequested ? (
        <button type="submit" className="h-25 w-full rounded-lg bg-sub px-8 font-bold" onClick={requestCode}>
          <span>인증요청</span>
        </button>
      ) : (
        <button type="submit" className="relative h-25 w-full rounded-lg bg-sub px-8 font-bold" disabled={isSubmitting}>
          {isVerificationRequested && (
            <div className="absolute left-10">
              <Timer time={180} onTimeout={expireVerificationCode} />
            </div>
          )}
          <span>{buttonLabel}</span>
        </button>
      )}
    </div>
  );
}
