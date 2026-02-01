import { type FC } from 'react';
import { Button } from 'src/components/Button';
import { Save } from 'src/components/Icon/Save';

import { useAppStore } from 'src/store';
import { useSaveMeme } from 'src/api/useSaveMeme';
import 'src/components/SaveButton/save-button.less';

const SaveButton: FC = () => {
  const meme = useAppStore((store) => store.state.meme);
  const requestSaveMemeRequest = useSaveMeme();
  const handleClickSaveMeme = () => {
    requestSaveMemeRequest(meme?.link || '', (link) => {
      window.location.href = link;
    });
  };
  return (
    <div className="save-button">
      <Button icon={<Save />} onClick={handleClickSaveMeme} />
    </div>
  );
};

export { SaveButton };
