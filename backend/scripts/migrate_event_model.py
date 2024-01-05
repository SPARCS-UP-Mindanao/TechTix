from constants.common_constants import EntryStatus
from model.entities import Entities
from model.events.event import Event
from pynamodb.attributes import BooleanAttribute, NumberAttribute, UnicodeAttribute


class EventOld(Entities, discriminator='Event'):
    name = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)
    status = UnicodeAttribute(null=True)
    email = UnicodeAttribute(null=True)
    startDate = UnicodeAttribute(null=True)
    endDate = UnicodeAttribute(null=True)
    venue = UnicodeAttribute(null=True)
    bannerLink = UnicodeAttribute(null=True)
    logoLink = UnicodeAttribute(null=True)
    autoConfirm = BooleanAttribute(null=True)
    payedEvent = BooleanAttribute(null=True)
    price = NumberAttribute(null=True)
    certificateTemplate = UnicodeAttribute(null=True)


def main():
    range_key_prefix = 'v0#'
    range_key_condition = EventOld.rangeKey.startswith(range_key_prefix)
    old_events = list(
        EventOld.query(
            hash_key='Event',
            range_key_condition=range_key_condition,
            filter_condition=EventOld.entryStatus == EntryStatus.ACTIVE.value,
        )
    )

    with Event.batch_write() as batch:
        items = [
            Event(
                hashKey='v0',
                rangeKey=f'{old_event.createdBy}#{old_event.entryId}',
                latestVersion=0,
                entryStatus=old_event.entryStatus,
                eventId=old_event.entryId,
                createDate=old_event.createDate,
                updateDate=old_event.updateDate,
                createdBy=old_event.createdBy,
                updatedBy=old_event.updatedBy,
                name=old_event.name,
                description=old_event.description,
                status=old_event.status,
                email=old_event.email,
                startDate=old_event.startDate,
                endDate=old_event.endDate,
                venue=old_event.venue,
                bannerLink=old_event.bannerLink,
                logoLink=old_event.logoLink,
                autoConfirm=old_event.autoConfirm,
                payedEvent=old_event.payedEvent,
                price=old_event.price,
                certificateTemplate=old_event.certificateTemplate,
            )
            for old_event in old_events
        ]
        for item in items:
            batch.save(item)


if __name__ == "__main__":
    main()
