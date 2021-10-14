
type defaultObj = {
  maxRetryTime: number;
  initialRetryTime: number;
  factor: number; // randomization factor
  multiplier: number; // exponential factor
  retries: number;
}

const defaultObj = {
  maxRetryTime: 30 * 1000,
  initialRetryTime: 300,
  factor: 0.2, // randomization factor
  multiplier: 2, // exponential factor
  retries: 5, // max retries
} 

export default defaultObj