import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import styles from '../styles/Home.module.css'


export default function Home() {
  const [email, setEmail] = useState('')
  const[password, setPassword] = useState('')

  const { signIn } = useContext(AuthContext)

  async function handleSubmit(){
    event?.preventDefault()

    const data = {
      email, 
      password
    }

    await signIn(data)
    
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} data-lpignore/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} data-lpignore/>

      <button type='submit'> Entrar </button>
    </form>
  )
}
