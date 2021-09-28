// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'versions'.
const versions = {
  0: ({
    transactionalId,
    producerId,
    producerEpoch,
    transactionResult
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v0/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v0/response')
    return {
      request: request({ transactionalId, producerId, producerEpoch, transactionResult }),
      response,
    }
  },
  1: ({
    transactionalId,
    producerId,
    producerEpoch,
    transactionResult
  }: any) => {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const request = require('./v1/request')
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
    const response = require('./v1/response')
    return {
      request: request({ transactionalId, producerId, producerEpoch, transactionResult }),
      response,
    }
  },
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  versions: Object.keys(versions),
  protocol: ({
    version
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  }: any) => versions[version],
}
