const express = require('express')
const app = express()

app.use(express.json())

const projects = []

// Check if ID param exist on request
const containsId = (req, res, next) => {
  const id = req.body.id || req.params.id

  if (!id) {
    return res.status(400).json({ error: `ID's field is missing.` })
  }

  req.id = id

  return next()
}

// Check if Title param exist on request
const containsTitle = (req, res, next) => {
  const { title } = req.body

  if (!title) {
    return res.status(400).json({ error: `Title's field is missing.` })
  }

  req.title = title

  return next()
}

// Returns an specific project
const getProject = (req, res) => {
  const id = req.body.id || req.params.id
  const project =  projects.find(pos => pos.id === id)

  req.project = project

  return project
}

// Returns all projects
app.get('/projects', (req, res) => {
  if (projects.length === 0) {
    return res.json({ message: `Projects' list is empty :(` })
  }
  return res.json(projects)
})

// Create a project
app.post('/projects', containsId, containsTitle, (req, res) => {
  if(getProject(req, res)) {
    return res.status(400).json({ error: `ID ${req.id} already exist.` })
  }
  
  projects.push({
    id: req.id,
    title: req.title,
    tasks: req.tasks || []
  })

  res.json(projects)
})

// Create a task to an specific project
app.post('/projects/:id/tasks', containsTitle, (req, res) => {
  if(!getProject(req, res)) {
    return res.status(400).json({
      error: `ID ${req.params.id} does not exist on project's list.`
    })
  }

  projects[projects.indexOf(req.project)].tasks.push(req.title)

  res.json(projects)
})

// Modify the title of an specific project
app.put('/projects/:id', containsTitle, (req, res) => {
  if(!getProject(req, res)) {
    return res.status(400).json({
      error: `ID ${req.params.id} does not exist on project's list.`
    })
  }

  projects[projects.indexOf(req.project)].title = req.title

  res.json(projects)
})

// Delete a project
app.delete('/projects/:id', containsId, (req, res) => {
  if(!getProject(req, res)) {
    return res.status(400).json({
      error: `ID ${req.params.id} does not exist on project's list.`
    })
  }

  projects.splice(projects.indexOf(req.project), 1)

  return res.json({ message: `Project ${req.id} deleted successfully` })
})

module.exports = app
