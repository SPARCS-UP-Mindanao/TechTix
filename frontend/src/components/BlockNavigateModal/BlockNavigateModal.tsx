import { FC } from 'react';
import AlertModal from '@/components/AlertModal';
import { useBlockNavigateModal } from './useBlockNavigateModal';

interface Props {
  title?: string;
  description?: string;
  condition: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

const BlockNavigateModal: FC<Props> = ({ title, description, condition, onOk, onCancel }) => {
  const { visible, onOpenChange, onCompleteAction, onCancelAction } = useBlockNavigateModal({ condition, onOk, onCancel });

  return (
    <AlertModal
      alertModalTitle={title || 'Are you sure you want to leave this page?'}
      alertModalDescription={description || 'Leaving the page may result in unfinished actions or unsaved data. Are you sure you want to leave?'}
      visible={visible}
      confirmVariant="negative"
      onCompleteAction={onCompleteAction}
      onCancelAction={onCancelAction}
      onOpenChange={onOpenChange}
    />
  );
};

export default BlockNavigateModal;
