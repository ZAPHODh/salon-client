'use server'

import { verifySession } from "@/lib/auth/dal"

export const getSchedules = async () => {
  const { session } = await verifySession()
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/appointments`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    })
    if (!response.ok) throw new Error('Erro na requisição')
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return []
  }
}

