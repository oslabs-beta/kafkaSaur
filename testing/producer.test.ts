import { assertEquals, assertExists} from "https://deno.land/std@0.110.0/testing/asserts.ts";

import {
  beforeEach,
  describe,
  expect,
  it,
  run,
} from "https://deno.land/x/tincan/mod.ts";

import {
  bench,
  BenchmarkRunProgress,
  ProgressState,
  runBenchmarks,
} from "https://deno.land/std@0.110.0/testing/bench.ts";

import { Kafka as Client, logLevel } from '../index.ts'
import createProducer from '../src/producer/index.ts'
import createConsumer from '../src/consumer/index.ts'
import createAdmin from '../src/admin/index.ts'
import { Cluster } from '../src/cluster/index.ts'
import ISOLATION_LEVEL from '../src/protocol/isolationLevel.ts'


const PRIVATE = {
  CREATE_CLUSTER: Symbol('private:Kafka:createCluster') as unknown as string,
  CLUSTER_RETRY: Symbol('private:Kafka:clusterRetry') as unknown as string,
  LOGGER: Symbol('private:Kafka:logger') as unknown as string,
  OFFSETS: Symbol('private:Kafka:offsets') as unknown as string,
};

Deno.test( "testing example",(): void => {
    assertEquals("world", "world");
    assertEquals({ hello: "world" }, { hello: "world" });
  },
);

// Deno.test({
//   name: "testing example",
//   fn(): void {
//     assertEquals("squirrel", "world");
//     assertEquals({ hello: "world" }, { hello: "world" });
//   },
// });

Deno.test("testing a producer on a  Kafka Client", ()=>{
  bench(function createClient(time): void {
    time.start();
    const testClient = new Client ({brokers: [`localhost:9092`]})
    assertExists(testClient.producer())
  
    time.stop();
  });

  runBenchmarks();

  
})


// const kafka = new Kafka({
  // logLevel: logLevel.INFO,
  // logCreator: PrettyConsoleLogger,
  // brokers: [`${host}:9092`],
  // clientId: 'example-producer',
  // ssl: {
  //   servername: 'localhost',
  //   rejectUnauthorized: false,
  //   ca: [Deno.readFileSync('./testHelpers/certs/cert-signed')], 
  // },
  // sasl: {
  //   mechanism: 'plain',
  //   username: 'test',
  //   password: 'testtest',
  // },
//});


Deno.test("testing a consumer on a  Kafka Client", ()=>{
  bench(function createClient(time): void {
    time.start();
    const testClient = new Client ({
      logLevel: logLevel.INFO,
      // logCreator: PrettyConsoleLogger,
      brokers: [`localhost:9092`],
      clientId: 'example-consumer'})

    assertExists(testClient.consumer({ groupId: 'test-group' })) 

    time.stop();
  });

  runBenchmarks();

  
})
