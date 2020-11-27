import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import db from '../database/connection'
import { compare } from 'bcryptjs'

export default class SessionController {
  async store (request: Request, response: Response) {
    const { email, password } = request.body

    try {
      const user = await db('users').where({ email }).first()
      if (!user) {
        return response.status(401).json({ error: 'Usuário não encontrado!' })
      }
      const checkPass = await compare(password, user.password)
      if (!checkPass) {
        return response.status(401).json({ error: 'Senha inválida!' })
      }

      const { id, name } = user

      return response.status(200).json({
        data: {
          id,
          name,
          email,
          token: jwt.sign({ id, email }, '12345', {
            expiresIn: '1d'
          })
        }
      })
    } catch (err) {
      return response.status(400).json({
        message: 'Não foi possível realizar o login!', error: err
      })
    }
  }
}
