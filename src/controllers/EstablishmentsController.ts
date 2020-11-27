import { Request, Response } from 'express'
import db from '../database/connection'
import { getDistanceFromLatLonInKm } from '../utils/calcDistance'

type EstablishmentRequestBodyPost = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
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
    const { lat, lng } = request.query
    console.log(lat, lng)
    if (lat && lng) {
      const establishmentsWithDistance = establishments
        .map((establishment) => {
          const distance = getDistanceFromLatLonInKm(
            Number(lat),
            Number(lng),
            Number(establishment.latitude),
            Number(establishment.longitude)
          )
          return { ...establishment, distance }
        })
        .sort((a, b) => {
          if (b.distance > a.distance) {
            return 1
          }
          if (b.distance < a.distance) {
            return -1
          }
          return 0
        })

      return response.status(200).json({
        data: establishmentsWithDistance
      })
    }

    return response.status(200).json({
      data: establishments
    })
  }

  async store (request: Request<{}, {}, EstablishmentRequestBodyPost>, response: Response) {
    const {
      name, description, latitude, longitude
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
        name, description, latitude, longitude, user_id: (request as any).user_id
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
      const existName = await trx('establishments').where({ name: establishmentUpdateData.name }).first()
      console.log(existName)
      if (existName) {
        await trx.commit()
        return response.status(400).json({
          message: 'Nome não alterado, já existe um estabelecimento com esse nome'
        })
      }
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
      const deleted = await trx('establishments').where({ id }).delete()
      await trx.commit()
      if (deleted) {
        return response.status(200).json({
          message: 'Estabelecimento deletado com sucesso!'
        })
      }
      return response.status(201).json({
        message: 'Estabelecimento não encontrado!'
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
