import React, { useState } from 'react';
import Button from '@/components/Button';
import FileViewerComponent from '@/components/FileViewerComponent';
import Modal from '@/components/Modal';
import { RegisterUserInfo } from '@/model/registrations';

interface Props {
  registrationInfo: RegisterUserInfo;
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
        <div className="flex flex-end gap-x-4">
          <Button onClick={() => setShowModal(false)} variant="outline" type="submit" className="w-full">
            Cancel
          </Button>
          <Button onClick={() => setShowModal(false)} variant="negative" type="submit" className="w-full">
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
