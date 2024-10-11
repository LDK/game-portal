import { PaddingOptions, MarginOptions, PositionOptions } from "../types/types";

type BoxProps = {
  className?: string;
  children: React.ReactNode;
} & PaddingOptions & MarginOptions & PositionOptions;

const Box = (props: BoxProps) => {
  const { className, children, ...rest } = props;

  const styleClasses = Object.keys(rest).map((key) => {
    const value = rest[key as keyof typeof rest];
    if (value === undefined) {
      return "";
    }
    return `${key}-${value}`;
  }).join(" ");

  return (
    <div className={`box ${className} ${styleClasses}`}>
      {children}
    </div>
  );
};

export default Box;