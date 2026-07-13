import { prisma } from '@/lib/prisma'



interface CreateFoundationDTO {
  name: string;
  document: string;
  manager: string;
}

export const foundationService = {
  create: async (data: CreateFoundationDTO) => {
    const documentExists = await prisma.foundation.findFirst({
      where: { document: data.document }
    })

    if (documentExists) {
      throw new Error('Já existe uma fundação cadastrada com este documento.')
    }

    return await prisma.foundation.create({ data })
  },

  findAll: async () => {
    return await prisma.foundation.findMany({
      include: {
        foundationCourses: {
          include: {
            course: true
          }
        }
      }
    })
  },

  getById: async (id: string) => {
    const foundation = await prisma.foundation.findUnique({
      where: { id },
      include: {
        foundationCourses: {
          include: {
            course: true
          }
        }
      }
    })

    if (!foundation) {
      throw new Error('Fundação não encontrada.')
    }

    return foundation
  },

  linkCourse: async (foundationId: string, courseId: string) => {
    const linkExists = await prisma.foundationCourse.findFirst({
      where: { foundationId, courseId }
    })

    if (linkExists) {
      throw new Error('Este curso já está vinculado a esta fundação.')
    }

    return await prisma.foundationCourse.create({
      data: { foundationId, courseId }
    })
  }
}
