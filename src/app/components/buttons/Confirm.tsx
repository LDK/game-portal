import { ButtonProps } from "@/app/types/types";
import Button from "./Button";

const Confirm = (btnOpts:ButtonProps) => (
  btnOpts.hidden ? null :
    <Button className={`confirm${btnOpts.className ? ' ' + btnOpts.className : '' }`} onClick={btnOpts?.onClick} label={btnOpts?.label || "OK"} />
);

export default Confirm;