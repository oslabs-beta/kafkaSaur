
<p align="center">
   <img src="https://github.com/oslabs-beta/kafkaSaur/blob/b8fdcfff957dd1bf9ca13973029e1f7d70165775/static_images/003365-vgrad.png" alt="Logo" />
    <p align="center">
       <a href="#" >
         <img src="https://github.com/oslabs-beta/kafkaSaur/blob/b8fdcfff957dd1bf9ca13973029e1f7d70165775/static_images/sirdeno-modified.png" alt="Logo" />
  </p> 
</p> 

<div align="center">
   
<a href=‘https://deno.land/x/kafkasaur@v0.0.3’><img src=‘https://img.shields.io/badge/version-v0.01-green’ /></a> 
<a href="https://github.com/oslabs-beta/kafkaSaur"><img src="https://img.shields.io/badge/license-MIT-blue"/></a>
<a href="https://github.com/oslabs-beta/kafkaSaur/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/oslabs-beta/kafkaSaur"></a>
<a href="https://github.com/oslabs-beta/kafkaSaur/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/oslabs-beta/kafkaSaur"></a>
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/kafkaSaur">

<a href="https://deno.land/x/kafkasaur@v0.0.3"><img src="http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black" /></a>
<a href="https://github.com/denoland/deno"><img src="https://img.shields.io/badge/deno-^1.3.2-lightgrey?logo=deno"/></a>
   
   <p align="center"> <strong>A native Deno client for Apache Kafka</strong></p>
   </div>


## Table of Contents
- [About the project](#about)
 - [Features](#features)
 - [Getting Started](#getting-started)
    - [Usage](#usage)
- [Developers](#developers)  
- [Acknowledgements](#acknowledgements)
- [License](#license)

## <a name="about"></a> About the Project
 KafkaSaur an Apache Kafka client for deno 
### <a name="getting-started"></a>
Getting Started
```sh
https://deno.land/x/kafkasaur@v0.0.3
```
### Prerequisites
 >Deno - https://deno.land/manual/getting_started/installation
 >
 >Apache Kafka - https://kafka.apache.org/
 >
 >Docker (for examples) -https://www.docker.com/
 


#### <a name="usage"></a> Usage
To run examples initiate Docker containers included in yaml file:
```sh
docker-compose up
```
Then run example producer/consumer files, in seperate terminals, with the following commands:
```sh
deno run --allow-all --unstable examples/example_producer.ts
deno run --allow-all --unstable examples/example_consumer.ts

```
Your two terminals (one Consuming, and one Producing) will now interact with the Broker and begin consuming and producing respectively.

With the Client imported into your application, you can write the producer/consumer logic like this:
```typescript
//producer example
import {Kafkasaur} from "https://deno.land/x/kafkasaur/index.ts"

const kafka = new Kafkasaur({
  clientId: 'example-producer',
  brokers: ['localhost:9092']
})

const topic = 'topic-test';

const producer = kafka.producer();

const testmessage = {
  key: 'key',
  value: 'hello there',
  headers: {'correlation-id': `${Date.now()}`}
}

const messages: object[] = [];
messages.push(testmessage)

const sendMessage = () => {
  producer.send({
    topic,
    messages
  })
}

const run = async() => {
  await producer.connect();
  sendMessage();
}

run()
```

```typescript
//consumer example
import {Kafkasaur} from "https://deno.land/x/kafkasaur/index.ts"

const kafka = new Kafkasaur({
  clientId: 'example-consumer',
  brokers: ['localhost:9092']
})

const topic = 'topic-test';

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  
  await consumer.run({
    eachMessage: async (message: any) => {
      console.log(message.value.toString())
    },
  })
}

run()
```

To run the instances of your Consumer/Producer be sure to pass the flags 
```sh
--allow-all
```
and
```sh
--unstable
```
when issuing your deno run command. This ensures that Deno as the proper configuration to communicate with the Broker, and to log any errors.
## Features

- 🛠 Built with [TypeScript][Deno]

- 🎬 Producer

- 🍴 Consumer

- 🤝 interactive producer with consumer

- 💂 deno's built in security; No file, network, or environment access, unless explicitly enabled
  


## Want to Contribute?

If you'd like to contribute and help grow the Deno community, just reach out to one of us via LinkedIn or write some code, and make a PR here! We're super excited about getting the conversation started, and working to bring Kafka to Deno!


## <a name="developers"></a> Developers

<table align="center">
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/samarnold723"><img src="https://media-exp1.licdn.com/dms/image/C4D03AQFJP-ywhKqpBg/profile-displayphoto-shrink_800_800/0/1615175949915?e=1639008000&v=beta&t=WylZ_LOJwbiey8Jicg0X-ODhSKqwAROCrZEDFOWxiYY" width="100px;" alt=""/><br /><sub><b>Sam Arnold</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/in/wesley-appleget"><img src="https://media-exp1.licdn.com/dms/image/C4E03AQG5AUxEE14WUw/profile-displayphoto-shrink_800_800/0/1517013766994?e=1639008000&v=beta&t=FKH576OIcSS6k2QwckD5LbqxOZMtqVCm527ql8FLv-M" width="100px;" alt=""/><br /><sub><b>Wesley Appleget</b></sub></a></td>
    <td align="center"><a href="#"><img src="https://ca.slack-edge.com/T01JVB0Q491-U01Q229LGQN-952f2dff651a-512" width="100px;" alt=""/><br /><sub><b>Adam Blackwell</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/in/benitezstephanie"><img src="https://i.pinimg.com/736x/33/32/6d/33326dcddbf15c56d631e374b62338dc.jpg" width="100px;" alt=""/><br /><sub><b>Stephanie Benitez</b></sub></a></td>
  </tr>
</table>



### <a name="acknowledgements"></a> Acknowledgements

- [Tommy Brunn](https://github.com/Nevon) - for his guidance and for trailblazing with KafkaJS
- [Ryan Dahl](https://github.com/ry) - for building an awesome community with Node.js and then leveling it up even further with Deno
- [Franz Kafka](https://en.wikipedia.org/wiki/Franz_Kafka) - for making us all remember, we could just be cockroaches. 


## <a name="license"></a> License


This product is licensed under the MIT License - see the LICENSE.md file for details.

This is an open source product.

This product is accelerated by [OS Labs](https://opensourcelabs.io/).

Apache Kafka and Kafka are either registered trademarks or trademarks of The Apache Software Foundation in the United States and other countries. KafkaJS has no affiliation with the Apache Software Foundation.



