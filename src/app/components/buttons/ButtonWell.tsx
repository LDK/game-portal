import Box from "../Box";
import Action from "./Action";
import Cancel from "./Cancel";
import Confirm from "./Confirm";

type ButtonTypeProps = {
  label?: string;
  onClick?: () => void;
  hidden?: boolean;
  disabled?: boolean;
};

type ButtonWellProps = {
  actions?: ButtonTypeProps[];
  cancel?: ButtonTypeProps;
  confirm?: ButtonTypeProps;
  className?: string;
};

const ButtonWell = ({ actions, cancel, confirm, className }:ButtonWellProps):JSX.Element => (
  <Box className={`button-well${className ? ' ' + className : ''}`}>
    {actions && actions.map((action, index) => <Action key={index} {...action} />)}
    {cancel && <Cancel {...cancel} />}
    {confirm && <Confirm {...confirm} />}
  </Box>
);

export default ButtonWell;