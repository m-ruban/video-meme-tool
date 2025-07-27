import { Button } from 'src/components/Button';
import { Save } from 'src/components/Icon/Save';

import 'src/components/SaveButton/save-button.less';

const SaveButton = () => {
  return (
    <div className="save-button">
      <Button
        icon={<Save />}
        onClick={() => {
          console.log('stop');
        }}
      />
    </div>
  );
};

export { SaveButton };
