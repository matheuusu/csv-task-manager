import { randomUUID } from "node:crypto"
import { Database } from "./database.js"

const database = new Database()

export const routes = [
  {
    method: "POST",
    path: "/tasks",
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Required field is missing in the request body." }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert("tasks", task)

      return res.writeHead(201).end(JSON.stringify({ message: "The task has created" }))
    }
  }
]