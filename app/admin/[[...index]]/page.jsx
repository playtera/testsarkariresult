import { connection } from 'next/server'
import StudioClient from './StudioClient'

export default async function StudioPage() {
  await connection()
  return <StudioClient />
}
