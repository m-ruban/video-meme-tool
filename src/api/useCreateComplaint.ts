import { useCallback } from 'react';
import { fetcher } from 'src/api/fetcher';
import { Complaint } from 'src/store';

interface CreateComplaintRequest {
  (complaint: Complaint,  onComplete: () => void): void;
}

const useCreateComplaint = (): CreateComplaintRequest => {
  return useCallback<CreateComplaintRequest>((complaint, onComplete) => {
    fetcher
      .post<Complaint>(`/api/v1/complaints/${complaint.memeId}/`, { ...complaint })
      .then(() => onComplete());
  }, []);
};

export { useCreateComplaint };
