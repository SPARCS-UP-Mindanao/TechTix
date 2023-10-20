import os

from pynamodb.attributes import (
    DiscriminatorAttribute,
    NumberAttribute,
    UnicodeAttribute,
)
from pynamodb.models import Model


class Entities(Model):
    class Meta:
        table_name = os.getenv('ENTITIES_TABLE')
        region = os.getenv('REGION')
        billing_mode = 'PAY_PER_REQUEST'

    cls = DiscriminatorAttribute()

    hashKey = UnicodeAttribute(hash_key=True)
    rangeKey = UnicodeAttribute(range_key=True)

    latestVersion = NumberAttribute(null=False)
    entryStatus = UnicodeAttribute(null=False)
    entryId = UnicodeAttribute(null=False)

    createDate = UnicodeAttribute(null=False)
    updateDate = UnicodeAttribute(null=False)
    createdBy = UnicodeAttribute(null=False)
    updatedBy = UnicodeAttribute(null=False)
