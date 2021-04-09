import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useFetch } from '@refetty/react'
import { addDays, subDays } from 'date-fns'
import axios from 'axios'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Button, Container, Box, IconButton, SimpleGrid, Spinner } from "@chakra-ui/react"

import { useAuth, Logo, formatDate } from './../components'

const getSchedule = async (when) => {
  return axios({
    method: 'get',
    url: '/api/schedule',
    params: { when, username: window.location.pathname }
  })
}

const Header = ({ children }) => (
  <Box p={4} display="flex" justifyContent="space-between" alignItems="center">
    {children}
  </Box>
)

const TimeBlock = ({time}) => {
  return (
    <Button p={8} bg="blue.500" color="white">
      {time}
    </Button>
  )
}

export default function Schedule () {
  const router = useRouter()
  const [auth, { logout }] = useAuth()
  const [when, setWhen] = useState(() => new Date())
  const [data, { loading, status, error }, fetch] = useFetch(getSchedule, { lazy: true })

  const addDay = () => setWhen(prevState => addDays(when, 1))
  const removeDay = () => setWhen(prevState => subDays(when, 1))

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

      <SimpleGrid p={4} columns={2} spacing={4}>
        {loading && <Spinner tickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />}
        {data?.map(time => <TimeBlock key={time} time={time} />)}
      </SimpleGrid>
    </Container>
  )
}