import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/login') // or '/dashboard' if token present
}
