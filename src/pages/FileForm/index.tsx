import { FC } from 'react';
import { Card } from 'src/components/Card';
import { CloudUpload } from 'src/components/Icon/CloudUpload';
import { StylusNote } from 'src/components/Icon/StylusNote';
import { Share } from 'src/components/Icon/Share';
import { BottomToTopArrow } from 'src/components/Arrow/BottomToTopArrow';
import { TopToBottomArrow } from 'src/components/Arrow/TopToBottomArrow';
import { Upload } from 'src/components/Upload';
import { getTrl } from 'src/lang/trls';
import { PageWithToken } from 'src/pages/PageWithApi';

import 'src/pages/FileForm/fileForm.less';

const FileForm: FC = () => {
  return (
    <PageWithToken>
      <div className="cards-and-form">
        <div className="cards-wrapper">
          <div className="cards">
            <Card index="1" title={getTrl('step1')} icon={<CloudUpload />} />
            <BottomToTopArrow />
            <Card index="2" title={getTrl('step2')} icon={<StylusNote />} />
            <TopToBottomArrow />
            <Card index="3" title={getTrl('step3')} icon={<Share />} />
          </div>
        </div>
        <Upload />
      </div>
    </PageWithToken>
  );
};

export { FileForm };
