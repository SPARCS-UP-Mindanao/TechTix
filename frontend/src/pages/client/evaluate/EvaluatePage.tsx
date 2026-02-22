import { useParams } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import Evaluate from './Evaluate';

const EvaluatePage = () => {
  const { eventId } = useParams();

  if (!eventId) {
    return <ErrorPage />;
  }

  return <Evaluate eventId={eventId} />;
};

export const Component = EvaluatePage;

export default EvaluatePage;
