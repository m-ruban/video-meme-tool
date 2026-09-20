import { FC } from 'react';

const XsmallCross: FC = () => {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_416_19"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="15"
        height="15"
      >
        <rect width="15" height="15" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_416_19)">
        <path
          d="M3.1 13L2 11.9L6.4 7.5L2 3.1L3.1 2L7.5 6.4L11.9 2L13 3.1L8.6 7.5L13 11.9L11.9 13L7.5 8.6L3.1 13Z"
          fill="#2E343B"
        />
      </g>
    </svg>
  );
};

export { XsmallCross };
