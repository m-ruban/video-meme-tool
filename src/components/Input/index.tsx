import { forwardRef, ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { Merge } from 'type-fest';
import classnames from 'classnames';
import 'src/components/Input/input.less';

type InputSize = 'small' | 'medium';
type InputType = 'primary' | 'secondary';

interface InputHelper {
  value?: string | number;
  placeholder?: string;
  size?: InputSize;
  inputType?: InputType;
  disabled?: boolean;
  invalid?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export type InputProps = Merge<ComponentPropsWithoutRef<'input'>, InputHelper>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'small', inputType = 'primary', ...inputProps }, ref) => (
    <input
      ref={ref}
      className={classnames('input', `input_size-${size}`, `input_type-${inputType}`)}
      {...inputProps}
    />
  )
);

Input.displayName = 'Input';

export { Input };
