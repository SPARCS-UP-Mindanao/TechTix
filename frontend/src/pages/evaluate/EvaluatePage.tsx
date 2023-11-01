import React from 'react';
// import ClaimCertificate from './CertificateClaim';
// import EventInformation from './EventInformation';
// import EvaluationForm from './EvaluationForm';
// import QuestionBuilder from './QuestionBuilder';
import QuestionBuilder, { QuestionConfigItem } from '../evaluate/QuestionBuilder';

const QUESTIONS: QuestionConfigItem[] = [
  {
    name: 'question1',
    questionType: 'text_short',
    question: 'Lorem ipsum dolor sit amet?',
    options: []
  },
  {
    name: 'question2',
    questionType: 'text_long',
    question: 'Lorem ipsum dolor sit amet?',
    options: []
  },
  {
    name: 'question3',
    questionType: 'multiple_choice_dropdown',
    question: 'Multiple choice question - Single Answer',
    options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4']
  },
  {
    name: 'question4',
    questionType: 'multiple_choice',
    question: 'Multiple choice question - Single Answer',
    options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4']
  },
  {
    name: 'question5',
    questionType: 'multiple_answers',
    question: 'Multiple choice question - Multiple Answer',
    options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4']
  }
];

// import EvaluationQuestions from './EvaluationQuestions';

const EvaluatePage = () => {
  return (
    <>
      {/* <h1>EvaluatePage</h1> */}
      {/* <ClaimCertificate /> */}
      {/* <EventInformation /> */}
      {/* <EvaluationQuestions /> */}
      {/* <EvaluationForm /> */}
      <QuestionBuilder questions={QUESTIONS} />
    </>
  );
};

export default EvaluatePage;
