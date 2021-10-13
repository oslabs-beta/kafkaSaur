
[![deno version](https://img.shields.io/badge/version-v0.01-green)](https://deno.land/x)  
<p align="center">
   <img src="https://github.com/oslabs-beta/kafkaSaur/blob/b8fdcfff957dd1bf9ca13973029e1f7d70165775/static_images/003365-vgrad.png" alt="Logo" >
    <p align="center">
       <a href="#" >
         <img src="https://github.com/oslabs-beta/kafkaSaur/blob/b8fdcfff957dd1bf9ca13973029e1f7d70165775/static_images/sirdeno-modified.png" alt="Logo" >
  </p> 
</p> 

## Table of Contents
- [About the project](#about)
 - [Features](#features)
 - [Getting Started](#getting-started)
    - [Usage](#usage)
- [Developers](#Developers)  
  
- [License](#license)
- [Acknowledgements](#acknowledgements)

## <a name="about"></a> About the Project
 KafkaSaur an Apache Kafka client for deno 
### <a name="getting-started"></a>
Getting Started
```sh
https://deno.land/x/
```
### Prerequisites
 >deno - https://deno.land/manual/getting_started/installation
 >
 >docker -https://www.docker.com/
 


#### <a name="usage"></a> Usage
```sh
docker-compose up
```
```typescript
import {Kafkasaur} from "https://deno.land/x/kafkasaur/index.ts"

const kafkasaur = new Kafkasaur({
  clientId: 'my-app',
  brokers: ['kafka1:9092']
})
```
## Features
- 🛠 Built with [TypeScript][Deno]
- 🎬 Producer
 -🍴 Consumer
 -🤝 interactive producer with consumer
 -💂 deno's built in security; No file, network, or environment access, unless explicitly enabled
  
## Developers

<table align="center">
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/samarnold723"><img src="https://media-exp1.licdn.com/dms/image/C4D03AQFJP-ywhKqpBg/profile-displayphoto-shrink_800_800/0/1615175949915?e=1639008000&v=beta&t=WylZ_LOJwbiey8Jicg0X-ODhSKqwAROCrZEDFOWxiYY" width="100px;" alt=""/><br /><sub><b>Sam Arnold</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/in/wesley-appleget"><img src="https://media-exp1.licdn.com/dms/image/C4E03AQG5AUxEE14WUw/profile-displayphoto-shrink_800_800/0/1517013766994?e=1639008000&v=beta&t=FKH576OIcSS6k2QwckD5LbqxOZMtqVCm527ql8FLv-M" width="100px;" alt=""/><br /><sub><b>Wesley Appleget</b></sub></a></td>
    <td align="center"><a href="#"><img src="https://ca.slack-edge.com/T01JVB0Q491-U01Q229LGQN-952f2dff651a-512" width="100px;" alt=""/><br /><sub><b>Adam Blackwell</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/in/benitezstephanie"><img src="https://i.pinimg.com/736x/33/32/6d/33326dcddbf15c56d631e374b62338dc.jpg" width="100px;" alt=""/><br /><sub><b>Stephanie Benitez</b></sub></a></td>
  </tr>
</table>




## <a name="license"></a> License
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/oslabs-beta/kafkaSaur)

This product is licensed under the MIT License - see the LICENSE.md file for details.

This is an open source product.

This product is accelerated by [OS Labs](https://opensourcelabs.io/).

### <a name="acknowledgements"></a> Acknowledgements

## Feedback

If you have any feedback, please reach out to us

