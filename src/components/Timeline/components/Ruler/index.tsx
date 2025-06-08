import { useMemo } from 'react';
import classnames from 'classnames';
import 'src/components/Timeline/components/Ruler/ruler.less';

interface RulerProps {
  duration: number;
}

const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, i) => start + i);

const ticks = range(0, 10);

export const Ruler = ({ duration }: RulerProps) => {
  const bars = useMemo(() => range(0, Math.ceil(duration - 1)), [duration]);
  return (
    <div className="ruler">
      {bars.map((currentBar) => {
        return (
          <div key={currentBar} className="bar">
            <div className="label left">{currentBar}</div>
            {ticks.map((tick) => (
              <div
                key={tick}
                className={classnames('tick', { tallest: tick === 0 }, { tall: tick === 5 })}
              />
            ))}
            <div
              className={classnames(
                'tick',
                { last: bars.length - 1 !== currentBar },
                { tallest: bars.length - 1 === currentBar }
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
