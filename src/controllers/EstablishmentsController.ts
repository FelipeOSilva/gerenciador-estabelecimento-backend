import { Request, Response } from 'express'
import db from '../database/connection'

type EstablishmentRequestBodyPost = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  user_id: number;
}

type EstablishmentRequestBodyPut = {
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export default class EstablishmentsController {
  async index (request: Request, response: Response) {
    const establishments = await db('establishments').select()

    return response.status(200).json({
      data: establishments
    })
  }

  async store (request: Request<{}, {}, EstablishmentRequestBodyPost>, response: Response) {
    const {
      name, description, latitude, longitude, user_id
    } = request.body

    const establishmentExists = await db('establishments')
      .where('name', name)
      .first()

    console.log(establishmentExists)
    if (establishmentExists) {
      return response.status(400).json({ error: 'Estabelecimento já cadastrado!' })
    }
    const trx = await db.transaction()
    try {
      await trx('establishments').insert({
        name, description, latitude, longitude, user_id
      })

      await trx.commit()
      return response.status(201).json({
        message: 'Estabelecimento cadastrado com sucesso!',
        data: {
          name, description, latitude, longitude
        }
      })
    } catch (err) {
      await trx.rollback()
      return response.status(400).json({
        message: `Não foi possível cadastrar o estabelecimento ${name}`,
        error: err
      })
    }
  }

  async update (request: Request<{ id: number }, {}, EstablishmentRequestBodyPut>, response: Response) {
    const establishmentUpdateData = request.body
    const { id } = request.params

    const trx = await db.transaction()
    try {
      await trx('establishments').where({ id }).update(establishmentUpdateData)
      await trx.commit()

      return response.status(200).json({
        message: 'Estabelecimento atualizado com sucesso!',
        data:
          establishmentUpdateData
      })
    } catch (err) {
      await trx.rollback()
      return response.status(400).json({
        message: `Não foi possível atualizar o estabelecimento ${establishmentUpdateData.name}`,
        error: err
      })
    }
  }

  async destroy (request: Request<{ id: string }>, response: Response) {
    const { id } = request.params

    const trx = await db.transaction()
    try {
      await trx('establishments').where({ id }).delete()
      await trx.commit()

      return response.status(200).json({
        message: 'Estabelecimento deletado com sucesso!'
      })
    } catch (err) {
      await trx.rollback()
      return response.status(400).json({
        message: 'Não foi possível deletar o estabelecimento.',
        error: err
      })
    }
  }
}
