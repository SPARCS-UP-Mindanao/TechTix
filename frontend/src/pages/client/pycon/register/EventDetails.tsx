import { FC, ReactNode } from 'react';
import moment from 'moment';
import Icon from '@/components/Icon';
import RichTextContent from '@/components/RichContent/RichTextContent';
import { Event } from '@/model/events';
import { formatMoney } from '@/utils/functions';
import { useFileUrl } from '@/hooks/useFileUrl';

export const REGISTER_BUTTON_ID = 'REGISTER_BUTTON';

interface Props {
  event: Event;
  registerButton?: ReactNode;
}

const EventDetails: FC<Props> = ({
  event: { eventId, name, description, venue, status, startDate, endDate, paidEvent, price, hasMultipleTicketTypes, ticketTypes, logoLink, bannerLink },
  registerButton
}) => {
  const isSameDayEvent = moment(startDate).isSame(endDate, 'day');
  const getDate = () => {
    if (isSameDayEvent) {
      return `${moment(startDate).format('MMMM Do YYYY, h:mm A')} - ${moment(endDate).format('LT')}`;
    }
    return `${moment(startDate).format('MMMM Do YYYY, h:mm A')} - ${moment(endDate).format('MMMM Do YYYY')}`;
  };

  const eventPrice = hasMultipleTicketTypes && ticketTypes ? Math.min(...ticketTypes.map((x) => x.price)) : price;

  const { fileUrl: bannerUrl } = useFileUrl(eventId, bannerLink);
  const { fileUrl: logoUrl } = useFileUrl(eventId, logoLink);

  return (
    <section className="flex flex-col items-center max-w-3xl p-2 mx-auto">
      {logoLink && <img src={logoUrl} className="w-12 h-12 rounded-full overflow-hidden" alt="" />}
      {bannerLink && <div className="h-60 my-4 w-fit">{<img className="max-h-60" src={bannerUrl} alt="" />}</div>}
      <h1 className="text-3xl! w-full mb-2">{name}</h1>

      <div className="w-full grid grid-cols-[auto_1fr] text-pycon-custard justify-center items-center gap-x-4 gap-y-2">
        <Icon name="Clock" className="col-span-1" />
        <p className="text-sm col-span-1 font-nunito">{getDate()}</p>

        <Icon name="MapPin" className="col-span-1" />
        <p className="text-sm col-span-1 font-nunito">{venue}</p>

        {paidEvent && status !== 'completed' && (
          <>
            <Icon name="Banknote" className="col-span-1" />
            <p className="text-sm col-span-1 font-nunito">{formatMoney(eventPrice, 'PHP')}</p>
          </>
        )}
      </div>

      {registerButton ?? <div id={REGISTER_BUTTON_ID} />}

      {description && (
        <>
          <hr className="w-full mt-4 border-pycon-custard" />

          <article className="w-full p-2">
            <p className="font-nunito text-pycon-custard text-base mb-3 underline underline-offset-4 font-bold">About the event</p>
            <RichTextContent className="font-nunito! text-pycon-custard" content={description} />
          </article>
        </>
      )}
    </section>
  );
};

export default EventDetails;
