import { FC, useState } from 'react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Evaluation } from '@/model/evaluations';
import { questionToDisplayMap } from '@/pages/evaluate/questionsConfig';

const displayAnswers = (evaluation: Evaluation) => {
  const { questionType } = evaluation;
  switch (questionType) {
    case 'text':
      return <span>{evaluation.answer}</span>;
    case 'multiple_choice':
      return <span>{evaluation.answerScale}</span>;
    case 'boolean':
      return <span>{evaluation.booleanAnswer ? 'Yes' : 'No'}</span>;
  }
};

interface Props {
  fullName: string;
  evaluations: Evaluation[];
}

const EvaluationInfoModal: FC<Props> = ({ fullName, evaluations }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Modal
      modalTitle={fullName + ' Evaluations'}
      visible={showModal}
      onOpenChange={setShowModal}
      trigger={<Button variant="ghost" size="icon" icon="MoreHorizontal" />}
    >
      <div className="flex flex-col gap-5">
        {evaluations.map((evaluation) => (
          <div key={evaluation.question} className="flex flex-col w-full gap-1">
            <p className="font-bold">{questionToDisplayMap.get(evaluation.question!)}</p>
            <p className="p-2 rounded-sm bg-input">{displayAnswers(evaluation)}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default EvaluationInfoModal;
