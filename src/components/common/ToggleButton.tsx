type ToggleButtonProps = {
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ToggleButton({ id, checked, onChange: handleChange }: ToggleButtonProps) {
  return (
    <label htmlFor={id} className="relative inline-block h-10 w-20">
      <input
        id={id}
        type="checkbox"
        className="peer h-0 w-0 border-main opacity-0"
        checked={checked}
        onChange={handleChange}
      />
      {/* prettier-ignore */}
      <span className="
      absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-full bg-disable transition duration-300
      before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:size-7
      before:rounded-full before:bg-white before:transition before:duration-300
      peer-checked:bg-main peer-checked:before:translate-x-9
    "/>
    </label>
  );
}
