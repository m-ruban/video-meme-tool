import { FC } from 'react';

const Loading: FC = () => {
  return (
    <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="32.5"
        cy="32.5"
        r="24"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="115 40"
      />
    </svg>
  );
};

export { Loading };
