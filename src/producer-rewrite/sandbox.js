function groupByTopic (payloads) {
  return payloads.reduce(function (out, p) {
    out[p.topic] = out[p.topic] || {};
    out[p.topic][p.partition] = p;
    return out;
  }, {});
}

// {
//   topic: string;
//   messages: any; // string[] | Array<KeyedMessage> | string | KeyedMessage
//   key?: string | Buffer; //optional?
//   partition?: number; //optional?
//   attributes?: number; //optional?
// }

//this comes from baseProducer on line 129 ** THIS IS HOW PAYLOADS ARE BUILT!!! LONG STORY SHORT - ARRAY OF ARRAYS ***
//this is not gona work but see comments
const buildPayloads = function (payloads, topicMetadata) { //PAYLOADS MUST BE AN ARRAY
  //create empty object to return
  const topicPartitionRequests = Object.create(null); 

  //GIANT FOR EACH ON PAYLOADS ARRAY
  payloads.forEach(p => {
    //check if there is already a partition, if not we get the partition fromt the metadata
    p.partition = p.hasOwnProperty('partition')
      ? p.partition
      : this.partitioner.getPartition(_.map(topicMetadata[p.topic], 'partition'), p.key);
    //check if there are any attributes, if not we pass in 0
    p.attributes = p.hasOwnProperty('attributes') ? p.attributes : 0;
    //check if the messages proprety is in an array, if not, put it in one
    let messages = _.isArray(p.messages) ? p.messages : [p.messages];
    //check if the individual messages are instanes of KeyedMessage, if not, make them one
    messages = messages.map(function (message) {
      if (message instanceof KeyedMessage) {
        return message;
      }
      return new Message(0, 0, p.key, message, p.timestamp || Date.now());
      //Message: ['magic', 'attributes', 'key', 'value', 'timestamp'],
    });
    //create a string value for our object from the beginning(why???)
    let key = p.topic + p.partition;
    //create a value for that key (why???)
    let request = topicPartitionRequests[key];
    //if that value doesnt exist (why would it??), create a produce request
    if (request == null) {
      topicPartitionRequests[key] = new ProduceRequest(p.topic, p.partition, messages, p.attributes);
  
    } else {
      //idk what the fuck this is doing
      assert(request.attributes === p.attributes);
      Array.prototype.push.apply(request.messages, messages);
    }
  });
  //return an array of produce requests, so it would look like
//   //[ {
//   topic: string;
//   messages: any; // string[] | Array<KeyedMessage> | string | KeyedMessage
//   key?: string | Buffer;
//   partition?: number;
//   attributes?: number;
// //}]
  return _.values(topicPartitionRequests);
};

//the function returned by below i think is produce request, cant get this bullshit to work
function createStruct () {
  var args = arguments[0];
  return function () {
    for (var i = 0; i < args.length; i++) {
      this[args[i]] = arguments[i];
    }
  };
}

const mockRequest = [{
  topic: 'wtf',
  messages: 'wtfwtf',
  partition: 0,
  attributes: 0
}]

//ProduceRequest: ['topic', 'partition', 'messages', 'attributes']

// //this is right
// const created = createStruct([['topic', 'partition', 'messages', 'attributes']]);
// console.log(created)
// const butt = created([0, 0, 0, 0])
// console.log(butt)


// const tester = {
//   topic: 'wtf',
//   messages: 'is happening', 
//   //key,
//   partition: 0, 
//   attributes: 0 
// }

// //mock buildpayloads output
// //messages may be wrong?
// const tester2 = [['wtf', 0, 'ishappening', 0]]


