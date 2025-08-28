import { forwardRef, ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { Merge } from 'type-fest';
import 'src/components/Input/input.less';

interface InputHelper {
  value?: string | number;
  placeholder?: string;
  size?: number;
  disabled?: boolean;
  invalid?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export type InputProps = Merge<ComponentPropsWithoutRef<'input'>, InputHelper>;

const Input = forwardRef<HTMLInputElement, InputProps>((inputProps, ref) => (
  <input ref={ref} className={'input'} {...inputProps} />
));

Input.displayName = 'Input';

export { Input };
