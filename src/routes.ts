import express from 'express'
import EstablishmentsController from './controllers/EstablishmentsController'
import UsersController from './controllers/UsersController'

const routes = express.Router()
const usersController = new UsersController()
const establishmentsController = new EstablishmentsController()

routes.post('/users', usersController.store)
routes.get('/establishments', establishmentsController.index)
routes.post('/establishments', establishmentsController.store)
routes.put('/establishments/:id', establishmentsController.update)
routes.delete('/establishments/:id', establishmentsController.destroy)

export default routes
