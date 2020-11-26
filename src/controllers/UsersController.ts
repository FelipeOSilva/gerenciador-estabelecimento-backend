import { Request, Response } from 'express'
import db from '../database/connection'

type UserPostRequest = {
  name: string;
  email: string;
  password: string;
}

export default class UsersController {
  async store (request: Request<{}, {}, UserPostRequest>, response: Response) {
    const {
      name, email, password
    } = request.body

    const userExists = await db('users')
      .where('email', email)
      .first()

    if (userExists) {
      return response.status(400).json({ message: 'Usuário já cadastrado!' })
    }

    const trx = await db.transaction()
    try {
      await trx('users').insert({
        name, email, password
      })

      await trx.commit()
      return response.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        data: {
          name, email
        }
      })
    } catch (err) {
      await trx.rollback()
      return response.status(400).json({
        message: `Não foi possível cadastrar o usuário ${name}`,
        error: err
      })
    }
  }
}
