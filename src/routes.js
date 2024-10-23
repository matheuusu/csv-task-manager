import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query

      const data = database.select("tasks", search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(data))
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Required field is missing in the request body" }))
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

      return res
        .writeHead(201)
        .end(JSON.stringify({ message: "The task has created" }))
    }
  },
  {
    method: "PUT",
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body ?? {}

      const [existingTask] = database.select('tasks', { id })


      if (!existingTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }))
      }

      if (!title && !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Required field, title or description, is missing in the request body" }))
      }

      database.update('tasks', id, {
        title: title ?? existingTask.title,
        description: description ?? existingTask.description,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params

      const [existingTask] = database.select('tasks', { id })

      if (!existingTask) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]