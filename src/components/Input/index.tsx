import { FC, ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { Merge } from 'type-fest';
import 'src/components/Input/input.less';

export type InputProps = Merge<
  ComponentPropsWithoutRef<'input'>,
  {
    value?: string | number;
    placeholder?: string;
    size?: number;
    disabled?: boolean;
    invalid?: boolean;
    rounded?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  }
>;

const Input: FC<InputProps> = ({ placeholder, rounded, ...inputProps }) => (
  <input className={'input'} placeholder={placeholder} {...inputProps} />
);

export { Input };
