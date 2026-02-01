import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from 'react';
import { Merge } from 'type-fest';
import 'src/components/Select/select.less';

interface SelectHelper {
  children: ReactNode;
}

export type SelectProps = Merge<ComponentPropsWithoutRef<'select'>, SelectHelper>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ children, ...selectProps }, ref) => (
  <div className="select">
    <select ref={ref} className="select-content" {...selectProps}>
      {children}
    </select>
    <span className="arrow" />
  </div>
));

Select.displayName = 'Select';

export { Select };
