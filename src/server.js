import { createServer } from "node:http"
import { json } from "./middlewares/json.js"

const server = createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  return res
    .writeHead(404).end(JSON.stringify({ message: "The route is not found" }))
})

server.listen(3333, () => {
  console.log("Server is running")
})