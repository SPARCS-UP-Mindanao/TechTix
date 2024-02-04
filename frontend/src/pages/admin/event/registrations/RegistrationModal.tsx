import React, { useState } from 'react';
import Button from '@/components/Button';
import FileViewerComponent from '@/components/FileViewerComponent';
import Modal from '@/components/Modal';
import { Registration } from '@/model/registrations';

interface Props {
  registrationInfo: Registration;
}

const RegistrationModal: React.FC<Props> = ({ registrationInfo }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Modal
      modalTitle="User Info"
      visible={showModal}
      onOpenChange={setShowModal}
      trigger={<Button variant="ghost" size="icon" icon="MoreHorizontal" />}
      modalFooter={
        <div className="flex justify-end gap-x-2">
          <Button onClick={() => setShowModal(false)} variant="ghost">
            Cancel
          </Button>
          <Button onClick={() => setShowModal(false)} variant="negative" type="submit">
            Delete
          </Button>
        </div>
      }
    >
      <h4>{registrationInfo.registrationId}</h4>
      {registrationInfo.gcashPayment && <FileViewerComponent objectKey={registrationInfo.gcashPayment} />}
    </Modal>
  );
};

export default RegistrationModal;
