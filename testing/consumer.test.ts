import { assertEquals} from "https://deno.land/std@0.110.0/testing/asserts.ts";
import {
  bench,
  BenchmarkRunProgress,
  ProgressState,
  runBenchmarks,
} from "https://deno.land/std@0.110.0/testing/bench.ts";

import { Kafka as Client } from '../index.ts'
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

Deno.test({
  name: "testing example",
  fn(): void {
    assertEquals("squirrel", "world");
    assertEquals({ hello: "world" }, { hello: "world" });
  },
});


bench(function createClient(time): void {
  time.start();
  const testClient = new Client ({brokers: []})
  time.stop();
});

runBenchmarks();

