import fs from "node:fs";
import { parse } from 'csv-parse';
import { setTimeout } from "node:timers/promises";

const csvPath = new URL('tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

async function run() {
  const linesParse = stream.pipe(csvParse)

  for await (const line of linesParse) {
    const [title, description] = line

    await fetch('http://localhost:3333/tasks', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description
      })
    })

    await setTimeout(1000);
  }
}

run()

