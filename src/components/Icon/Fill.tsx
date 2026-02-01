import { CSSProperties, FC } from 'react';

const Fill: FC<{ style: CSSProperties }> = ({ style }) => {
  return (
    <svg
      style={style}
      width="40"
      height="20"
      viewBox="0 0 40 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_295_69)">
        <path d="M0 10H40" stroke="#728698" strokeWidth="2" />
        <path
          d="M11 10C11 5.02944 8.76142 1 6 1C3.23858 1 1 5.02944 1 10"
          stroke="#728698"
          strokeWidth="2"
        />
        <path
          d="M21 10C21 14.9706 18.7614 19 16 19C13.2386 19 11 14.9706 11 10"
          stroke="#728698"
          strokeWidth="2"
        />
        <path d="M21 10C21 5.02944 23.2386 1 26 1" stroke="#728698" strokeWidth="2" />
        <line x1="25.5" y1="1" x2="25.5" y2="10" stroke="#728698" strokeDasharray="1 1" />
      </g>
      <defs>
        <clipPath id="clip0_295_69">
          <rect width="40" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export { Fill };
