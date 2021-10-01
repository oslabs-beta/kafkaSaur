
type defaultObj = {
  maxRetryTime: Number;
  initialRetryTime: Number;
  factor: Number; // randomization factor
  multiplier: Number; // exponential factor
  retries: Number;
}

const defaultObj = {
  maxRetryTime: 30 * 1000,
  initialRetryTime: 300,
  factor: 0.2, // randomization factor
  multiplier: 2, // exponential factor
  retries: 5, // max retries
} 

export defaultObj