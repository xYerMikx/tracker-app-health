import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1 as result`
    
    return NextResponse.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    console.error('Health check failed:', err)
    return NextResponse.json({ status: 'error', db: 'disconnected' }, { status: 500 })
  }
}
