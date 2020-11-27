import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default async (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers

  if (!authorization) {
    return response.status(401).json({ error: 'Token não fornecido!' })
  }

  const [, token] = authorization.split(' ')
  try {
    jwt.verify(token, '12345', function (err, decoded: any) {
      if (err) { return response.status(400).send({ message: 'Token inválido!' }) }
      (request as any).user_id = decoded.id
      return next()
    })
  } catch (err) {
    return response.status(400).json({ error: 'Erro ao verificar o Token!' })
  }
}
