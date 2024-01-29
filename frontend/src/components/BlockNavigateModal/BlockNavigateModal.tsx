import { FC } from 'react';
import AlertModal from '@/components/AlertModal';
import { useBlockNavigateModal } from './useBlockNavigateModal';

interface Props {
  condition: boolean;
}

const BlockNavigateModal: FC<Props> = ({ condition }) => {
  const { visible, onOpenChange, onCompleteAction, onCancelAction } = useBlockNavigateModal(condition);

  return (
    <AlertModal
      alertModalTitle="Are you sure you want to leave this page?"
      alertModalDescription="Leaving the page may result in unfinished actions or unsaved data. Are you sure you want to leave?"
      visible={visible}
      confirmVariant="negative"
      onCompleteAction={onCompleteAction}
      onCancelAction={onCancelAction}
      onOpenChange={onOpenChange}
    />
  );
};

export default BlockNavigateModal;
