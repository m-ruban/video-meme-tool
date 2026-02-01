import { type ReactNode, type FC } from 'react';
import { useApiToken } from 'src/api/useApiToken';
import { useAppStore } from 'src/store';

const PageWithToken: FC<{ children: ReactNode }> = ({ children }) => {
  const token = useAppStore((store) => store.state.token);
  useApiToken();
  if (!token) {
    return null;
  }
  return children;
};

export { PageWithToken };
