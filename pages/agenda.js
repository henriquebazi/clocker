import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useFetch } from '@refetty/react'
import { addDays, subDays } from 'date-fns'
import axios from 'axios'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Button, Container, Box, IconButton } from "@chakra-ui/react"

import { getToken } from './../config/firebase/client'
import { useAuth, Logo, formatDate } from './../components'

const getAgenda = async (when) => {
  const token = await getToken()
  
  return axios({
    method: 'get',
    url: '/api/agenda',
    params: { when },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

const Header = ({ children }) => (
  <Box p={4} display="flex" justifyContent="space-between" alignItems="center">
    {children}
  </Box>
)

export default function Agenda () {
  const router = useRouter()
  const [auth, { logout }] = useAuth()
  const [when, setWhen] = useState(() => new Date())
  const [data, { loading, status, error }, fetch] = useFetch(getAgenda, { lazy: true })

  const addDay = () => setWhen(prevState => addDays(when, 1))
  const removeDay = () => setWhen(prevState => subDays(when, 1))

  useEffect(() => {
    !auth.user && router.push('/')
  }, [auth.user])

  useEffect(() => {
    fetch(when)
  }, [when])

  return (
    <Container>
      <Header mt={8}>
        <Logo size={150} />
        <Button onClick={logout}>Sair</Button>
      </Header>

      <Box display="flex" alignItems="center" >
        <IconButton icon={<ChevronLeftIcon />} bg="transparent" onClick={removeDay} />
        <Box flex={1} textAlign="center">
          {formatDate(when, 'PPPP')}
        </Box>
        <IconButton icon={<ChevronRightIcon />} bg="transparent" onClick={addDay} />
      </Box>
    </Container>
  )
}