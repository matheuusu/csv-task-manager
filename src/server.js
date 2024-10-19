import { createServer } from "node:http"

const server = createServer((req, res) => {

  return res
    .writeHead(404).end(JSON.stringify({ message: "The route is not found" }))
})

server.listen(3333, () => {
  console.log("Server is running")
})