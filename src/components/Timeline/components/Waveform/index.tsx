import 'src/components/Timeline/components/Waveform/wave-form.less';

interface WaveformProps {
  path: string;
}

export const Waveform = ({ path }: WaveformProps) => {
  return (
    <div className="waveform">
      <img src={path} alt="Waveform" />
    </div>
  );
};
