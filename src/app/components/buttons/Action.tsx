import { ButtonProps } from "@/app/types/types";
import Button from "./Button";

const Action = (btnOpts:ButtonProps) => (
  <Button className={`action${btnOpts.className ? ' ' + btnOpts.className : '' }`} onClick={btnOpts?.onClick} label={btnOpts?.label || "Go"} />
);

export default Action;