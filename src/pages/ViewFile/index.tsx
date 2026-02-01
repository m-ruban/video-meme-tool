import { type FC } from 'react';
import { PlayerWithComplaints } from 'src/components/PlayerWithComplaints';
import { PageWithToken } from 'src/pages/PageWithApi';

const ViewFile: FC = () => {
  return (
    <PageWithToken>
      <PlayerWithComplaints />
    </PageWithToken>
  );
};

export { ViewFile };
