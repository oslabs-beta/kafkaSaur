/** @format */

const versions: any = {
  0: ({ transactionalId, producerId, producerEpoch, topics }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v0/request');
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v0/response');
    return {
      request: request({ transactionalId, producerId, producerEpoch, topics }),
      response,
    };
  },
  1: ({ transactionalId, producerId, producerEpoch, topics }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v1/request');
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v1/response');
    return {
      request: request({ transactionalId, producerId, producerEpoch, topics }),
      response,
    };
  },
};

export default {
  versions: Object.keys(versions),
  protocol: ({
    version,
  }: 
  any) => versions[version],
};
