/** @format */
import requestv0 from './v0/request.ts';
import responsev0 from './v0/response.ts';
import requestv1 from './v1/request.ts'; 
import responsev1 from './v1/response.ts';

const versions: any = {
  0: ({ transactionalId, producerId, producerEpoch, topics }: any) => {
    const request = requestv0
    const response = responsev0
    return {
      request: request({ transactionalId, producerId, producerEpoch, topics }),
      response,
    };
  },
  1: ({ transactionalId, producerId, producerEpoch, topics }: any) => {
    const request = requestv1
    const response = responsev1
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
