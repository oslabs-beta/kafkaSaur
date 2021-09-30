let id = 0
const nextId = () => {
  if (id === Number.MAX_VALUE) {
    id = 0
  }

  return id++
}

export class InstrumentationEvent {
  id: any;
  payload: any;
  timestamp: any;
  type: any;
  /**
   * @param {String} type
   * @param {Object} payload
   */
  constructor(type: any, payload: any) {
    this.id = nextId()
    this.type = type
    this.timestamp = Date.now()
    this.payload = payload
  }
}




