// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  maxRetryTime: 1000,
  initialRetryTime: 50,
  factor: 0.02, // randomization factor
  multiplier: 1.5, // exponential factor
  retries: 15, // max retries
}
