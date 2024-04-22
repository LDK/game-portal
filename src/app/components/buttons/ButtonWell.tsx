import Box from "../Box";
import Action from "./Action";
import Cancel from "./Cancel";
import Confirm from "./Confirm";

type ButtonTypeProps = {
  label?: string;
  onClick?: () => void;
};

type ButtonWellProps = {
  action?: ButtonTypeProps;
  cancel?: ButtonTypeProps;
  confirm?: ButtonTypeProps;
  className?: string;
};

const ButtonWell = ({ action, cancel, confirm, className }:ButtonWellProps):JSX.Element => (
  <Box className={`button-well${className ? ' ' + className : ''}`}>
    {action && <Action {...action} />}
    {cancel && <Cancel {...cancel} />}
    {confirm && <Confirm {...confirm} />}
  </Box>
);

export default ButtonWell;