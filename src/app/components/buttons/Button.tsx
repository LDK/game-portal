import { ButtonProps } from "@/app/types/types";

const Button = (btnOpts:ButtonProps) => {
  if (!btnOpts) return null;

  console.log("Button", btnOpts);

  if (btnOpts.hidden) return null;

  return (
    <button className={btnOpts.className ? btnOpts.className : ''} onClick={btnOpts?.onClick} disabled={btnOpts?.disabled}>
      {btnOpts?.label}
    </button>
  );
};

export default Button;