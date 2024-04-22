import { ButtonProps } from "@/app/types/types";

const Button = (btnOpts:ButtonProps) => (
  <button className={btnOpts.className ? btnOpts.className : ''} onClick={btnOpts?.onClick}>
    {btnOpts?.label}
  </button>
);

export default Button;