import { FC, useState } from 'react';
import Button from '@/components/Button';
import { FormItemContainer } from '@/components/Form';
import Modal from '@/components/Modal';
import { EvaluationResponse } from '@/model/evaluations';
import { QUESTIONS } from '@/pages/client/pycon/evaluate/questionBuilder/questionsConfig';

const DisplayAnswerSwitch = (evaluation: EvaluationResponse) => {
  const { questionType } = evaluation;
  switch (questionType) {
    case 'text':
      return <span>{evaluation.answer}</span>;
    case 'multiple_choice':
      return <span>{evaluation.answerScale}</span>;
    case 'boolean':
      return <span>{evaluation.booleanAnswer ? 'Yes' : 'No'}</span>;
    default:
      return <span>{evaluation.answer || evaluation.answerScale || evaluation.booleanAnswer || evaluation.multipleAnswers}</span>;
  }
};

interface Props {
  fullName: string;
  evaluationList: EvaluationResponse[];
}

const EvaluationInfoModal: FC<Props> = ({ fullName, evaluationList }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Modal
      modalTitle={fullName + ' Evaluation Answers'}
      visible={showModal}
      onOpenChange={setShowModal}
      className="md:max-w-[80%] max-h-[80%]"
      trigger={<Button variant="ghost" size="icon" icon="Ellipsis" />}
      modalFooter={
        <Button onClick={() => setShowModal(false)} variant="ghost">
          Close
        </Button>
      }
    >
      <div className="w-full h-full overflow-auto flex flex-col flex-wrap gap-y-6 items-center justify-center">
        {evaluationList.map((evaluation) => {
          return (
            <FormItemContainer key={evaluation.question} halfSpace>
              <p className="font-bold">{QUESTIONS.get(evaluation.question!)}</p>
              <p className="p-2 rounded-sm bg-input">{DisplayAnswerSwitch(evaluation)}</p>
            </FormItemContainer>
          );
        })}
      </div>
    </Modal>
  );
};

export default EvaluationInfoModal;
