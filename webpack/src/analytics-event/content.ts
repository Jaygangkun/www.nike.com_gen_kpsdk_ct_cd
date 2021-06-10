import { Content, RawEvent } from './analytics-event.d';

const getContent = (rawEvent: RawEvent): Content | undefined => {
  const { content } = rawEvent.properties;

  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return undefined;
  }

  const allAssetId =
    typeof content.allAssetIdString === 'string' &&
    content.allAssetIdString !== ''
      ? content.allAssetIdString.split('|')
      : undefined;

  const allContentPresent =
    typeof content.allContentPresentString === 'string' &&
    content.allContentPresentString !== ''
      ? content.allContentPresentString.split('|')
      : undefined;

  if (!allAssetId && !allContentPresent) {
    return undefined;
  }

  return {
    allAssetId,
    allContentPresent
  };
};

export { getContent };
