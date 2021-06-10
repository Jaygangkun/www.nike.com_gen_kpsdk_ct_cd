import {NIKE_DOTCOM_HOST} from '@nike/ux-tread-dotcom-constants';

const SEGMENT_EVENTS_SCHEMA_PREFIX = `${NIKE_DOTCOM_HOST}/assets/measure/schemas/digital-product/dotcom/platform/web/classification`;
const LOCATION_UPDATED_EVENT_SCHEMA = `${SEGMENT_EVENTS_SCHEMA_PREFIX}/experience-event/experience/nike-shop-client/event-type/track/event-name/location-updated/version/LATEST/schema.json`;

export const LOCATION_UPDATED = 'Location Updated';

export const eventNameLookup = {
    [LOCATION_UPDATED]: LOCATION_UPDATED_EVENT_SCHEMA,
};
