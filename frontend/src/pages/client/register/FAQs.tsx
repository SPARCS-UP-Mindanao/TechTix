import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
// import Skeleton from '@/components/Skeleton';
import { getFAQs } from '@/api/events';
import { useApiQuery } from '@/hooks/useApi';

const FAQs: FC = () => {
  const { eventId } = useParams();
  const { data: response /*isFetching*/ } = useApiQuery(getFAQs(eventId!));

  //   if (isFetching) {
  //     return (
  //       <div className="space-y-4">
  //         <Skeleton className="h-16" />
  //         <Skeleton className="h-16" />
  //         <Skeleton className="h-16" />
  //       </div>
  //     );
  //   }

  if (!response || (response && response?.data && !response?.data?.isActive) || !response?.data?.faqs.length) {
    return <></>;
  }

  const { faqs } = response.data;

  return (
    <div className="my-4">
      <h3>FAQs</h3>
      <Accordion type="multiple">
        {faqs.map((faq) => (
          <AccordionItem value={faq.id} key={faq.id}>
            <AccordionTrigger>
              <p className="text-sm">{faq.question}</p>
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQs;
