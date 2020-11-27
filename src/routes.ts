import express from 'express'
import EstablishmentsController from './controllers/EstablishmentsController'
import UsersController from './controllers/UsersController'
import SessionController from './controllers/SessionController'
import middlewares from './middlewares'

const routes = express.Router()
const usersController = new UsersController()
const sessionController = new SessionController()
const establishmentsController = new EstablishmentsController()

routes.post('/users', usersController.store)
routes.post('/login', sessionController.store)

routes.use(middlewares)

routes.get('/establishments', establishmentsController.index)
routes.post('/establishments', establishmentsController.store)
routes.put('/establishments/:id', establishmentsController.update)
routes.delete('/establishments/:id', establishmentsController.destroy)

export default routes
