import { useEffect, type FC, useState } from 'react';
import { useAppStore } from 'src/store';
import { Player } from 'src/components/Player';
import { Typography } from 'src/components/Typography';
import { useGetMeme } from 'src/api/useGetMeme';
import { useCreateComplaint } from 'src/api/useCreateComplaint';
import { Report } from 'src/components/Icon/Report';
import { Modal } from 'src/components/Modal';
import { Input } from 'src/components/Input';
import { Button } from 'src/components/Button';
import { Select } from 'src/components/Select';
import { getTrl } from 'src/lang/trls';

import 'src/components/PlayerWithComplaints/player-with-complaints.less';

const Spacing: FC<{ height: number }> = ({ height }) => <div style={{ height: `${height}px` }} />;

const DEFAULT_REASON = 'other';

const PlayerWithComplaints: FC = () => {
  const dispatch = useAppStore((store) => store.dispatch);
  const meme = useAppStore((store) => store.state.meme);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState(DEFAULT_REASON);

  const getMemeRequest = useGetMeme();
  const createComplaintRequest = useCreateComplaint();

  useEffect(() => {
    getMemeRequest(window.location.pathname, (result) => {
      dispatch({ type: 'meme/update', payload: result });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!meme) {
    return;
  }

  return (
    <>
      <Player
        meme={meme}
        actions={
          <div className="actions-complaint" onClick={() => setShow(true)}>
            <Report />
            <Typography mode="secondary">{getTrl('makeComplaint')}</Typography>
          </div>
        }
      />
      <Modal visible={show} onClose={() => setShow(false)}>
        <div className="complaint-modal">
          <Typography mode="primary" size="large" weight="bold">
            {getTrl('complaintTitle')}
          </Typography>
          <Spacing height={20} />
          <Typography mode="primary">{getTrl('complaintReason')}</Typography>
          <Spacing height={15} />
          <Select value={reason} onChange={(event) => setReason(event.target.value)}>
            <option value="copyright">{getTrl('reasonOption1')}</option>
            <option value={DEFAULT_REASON}>{getTrl('reasonOption2')}</option>
          </Select>
          <Spacing height={20} />
          <Typography mode="primary">{getTrl('complaintEmail')}</Typography>
          <Spacing height={15} />
          <Input
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            size="medium"
            inputType="secondary"
          />
          <Spacing height={20} />
          <Typography mode="primary">{getTrl('complaintText')}</Typography>
          <Spacing height={15} />
          <Input
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            autoComplete="off"
            size="medium"
            inputType="secondary"
          />
          <Spacing height={25} />
          <div className="complaint-modal-send">
            <Button
              onClick={() => {
                const complaint = {
                  memeId: meme.id,
                  description,
                  reason,
                  email,
                };
                createComplaintRequest(complaint, () => setShow(false));
              }}
            >
              {getTrl('complaintSend')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export { PlayerWithComplaints };
