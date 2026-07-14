import { prisma } from '../lib/prisma'
import { UserCreateInput } from '@/generated/models'
import { hash } from 'bcrypt'

export const userService = {
  create: async (data: UserCreateInput) => {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (emailExists) {
      throw new Error('E-mail already in use.')
    }

    const hashedPassword = await hash(data.password, 8) //encrypt password

    const newUser = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },

      select: {
        name: true,
        role: true,
      }
    })

    return newUser
  },

  findAll: async () => {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        phone: true,
        role: true,
      }
    })

    return users
  },

  update: async (id: string, data: UserCreateInput) => {
    const userExists = await prisma.user.findUnique({
      where: { id }
    })

    if (!userExists) {
      throw new Error('User not found.')
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        password: data.password ? await hash(data.password, 8) : userExists.password
      },
      select: {
        name: true,
        role: true,
      }
    })
    
    return updatedUser
  }
}
