import { ChangeEvent, FC, JSX } from 'react';
import { Merge } from 'type-fest';
import { Typography } from 'src/components/Typography';

import 'src/components/Chip/chip.less';

export interface BaseChipProps {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  labelProps?: JSX.IntrinsicElements['span'];
  wrapperProps?: JSX.IntrinsicElements['label'];
  checked?: boolean;
  value?: string;
  disabled?: boolean;
}

type ChipProps = Merge<JSX.IntrinsicElements['input'], BaseChipProps>;

const Chip: FC<ChipProps> = (props) => {
  const { children, labelProps, wrapperProps, checked, ...inputProps } = props;
  return (
    <label className="chip" {...wrapperProps}>
      <input {...inputProps} type="checkbox" className="chip-input" checked={checked} />
      <span className="chip-input-content" {...labelProps}>
        <Typography size="small" inline>
          {children}
        </Typography>
      </span>
    </label>
  );
};

export { Chip };
