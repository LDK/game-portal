import { ButtonProps } from "../../types/types";
import Button from "./Button";

const Cancel = (btnOpts:ButtonProps) => (
  btnOpts.hidden ? null :
    <Button className={`cancel${btnOpts.className ? ' ' + btnOpts.className : '' }`} onClick={btnOpts?.onClick} label={btnOpts?.label || "Cancel"} />
);

export default Cancel;