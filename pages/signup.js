import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as yup from 'yup'

import { Container, Box, Input, Button, Text, FormControl, FormLabel, FormHelperText, InputGroup, InputLeftAddon, Link } from '@chakra-ui/react'

import { Logo, useAuth} from '../components'

const validationSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
  username: yup.string().required('Preenchimento obrigatório')
})

export default function Home() {
  const [auth, { signup }] = useAuth()

  const router = useRouter()

  const formik = useFormik({
    onSubmit: signup,
    validationSchema,
    initialValues: {
      email: '',
      username: '',
      password: ''
    }
  })

  useEffect(() => {
    auth.user && router.push('/agenda')
  }, [auth.user])

  return (
    <Container p={4} centerContent>
      <Logo />
      <Box>
        <Text p={4} mt={8}>
          Crie sua agenda compartilhada
        </Text>
      </Box>

    <Box>
      <FormControl id="email" p={4} isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          type="email" 
          value={formik.values.email} 
          onChange={formik.handleChange} 
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && <FormHelperText textColor="#e74c3c">
          {formik.errors.email}
        </FormHelperText>}
      </FormControl>

      <FormControl id="password" p={4} isRequired>
        <FormLabel>Senha</FormLabel>
        <Input
          type="password" 
          value={formik.values.password} 
          onChange={formik.handleChange} 
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && <FormHelperText textColor="#e74c3c">
          {formik.errors.password}
        </FormHelperText>}
      </FormControl>


      <FormControl id="username" p={4} isRequired>
        <InputGroup>
          <InputLeftAddon children="clocker.com/" />
          <Input
            type="username" 
            value={formik.values.username} 
            onChange={formik.handleChange} 
            onBlur={formik.handleBlur}
          />
        </InputGroup>
        {formik.touched.username && <FormHelperText textColor="#e74c3c">
          {formik.errors.username}
        </FormHelperText>}
      </FormControl>


      <Box p={4}>
        <Button 
          width="100%" 
          onClick={formik.handleSubmit} 
          isLoading={formik.isSubmitting}
          colorScheme="blue"
        > 
          Cadastrar
        </Button>
      </Box>
    </Box>

    <Link href="/">
      Já possui uma conta? Entre aqui.
    </Link>
    </Container>
  )
}
