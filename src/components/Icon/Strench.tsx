import { CSSProperties, FC } from 'react';

const Strench: FC<{ style?: CSSProperties }> = ({ style }) => {
  return (
    <svg
      style={style}
      width="40"
      height="20"
      viewBox="0 0 40 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_295_68)">
        <path d="M0 10H40" stroke="#728698" strokeWidth="2" />
        <path
          d="M16 10C16 5.02944 12.6421 1 8.5 1C4.35786 1 1 5.02944 1 10"
          stroke="#728698"
          strokeWidth="2"
        />
        <path d="M31 10C31 5.02944 34.134 1 38 1" stroke="#728698" strokeWidth="2" />
        <path
          d="M31 9C31 14.5228 27.6421 19 23.5 19C19.3579 19 16 14.5228 16 9"
          stroke="#728698"
          strokeWidth="2"
        />
      </g>
      <defs>
        <clipPath id="clip0_295_68">
          <rect width="40" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export { Strench };
