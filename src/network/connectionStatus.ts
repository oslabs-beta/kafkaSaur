// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONNECTION... Remove this comment to see the full error message
const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTING: 'disconnecting',
  DISCONNECTED: 'disconnected',
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CONNECTED_... Remove this comment to see the full error message
const CONNECTED_STATUS = [CONNECTION_STATUS.CONNECTED, CONNECTION_STATUS.DISCONNECTING]

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CONNECTION_STATUS,
  CONNECTED_STATUS,
}
