import { useState } from "react";
import { useFormik } from 'formik'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { format } from "date-fns";
import axios from 'axios'
import * as yup from 'yup'

import { Input } from '../Input'

const setSchedule = async ({ date, ...data }) => {
  return axios({
    method: 'post',
    url: '/api/schedule',
    data: { 
      ...data,
      date: format(date, 'yyyy-MM-dd'),
      username: window.location.pathname.replace('/', '')
    }
  })
}

const ModalTimeBlock = ({ isOpen, onClose, onComplete, isSubmitting, children }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Faça sua Reserva</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {children}
      </ModalBody>
      <ModalFooter>
        {!isSubmitting && <Button variant="ghost" onClick={onClose}>Cancelar</Button>}
        <Button colorScheme="blue" mr={3} onClick={onComplete} isLoading={isSubmitting}>
          Reservar horário
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)



export const TimeBlock = ({ time, date, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(prevState => !prevState)

  const { values, handleSubmit, handleChange, handleBlur, errors, touched, isSubmitting } = useFormik({
    onSubmit: async (values) => {
      try {
        await  setSchedule({ ...values, time, date })
        toggle() 

      } catch (error) {
        console.log(error)
      }
    },
    initialValues: {
      name: '',
      phone: ''
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Preenchimento obrigatório'),
      phone: yup.string().required('Preenchimento obrigatório')
    })
  })

  return (
    <Button p={8} bg="blue.500" color="white" onClick={toggle} disabled={disabled}>
      {time}
      {!disabled && <ModalTimeBlock 
        isOpen={isOpen} 
        onClose={toggle} 
        onComplete={handleSubmit} 
        isSubmitting={isSubmitting}
      >
        <>
          <Input 
            label="Nome:"
            placeholder="Digite seu Nome" 
            error={errors.name}
            touched={touched.name}
            size="lg" 
            name="name" 
            value={values.name} 
            onChange={handleChange}
            onBlur={handleBlur} 
            disabled={isSubmitting} 
          />
          <Input 
            label="Telefone"
            placeholder="(99) 9 9999-9999" 
            error={errors.phone}
            touched={touched.phone}
            size="lg" 
            name="phone" 
            mask={['(99) 9999-9999', '(99) 9 9999-9999']}
            value={values.phone} 
            onChange={handleChange} 
            onBlur={handleBlur}
            disabled={isSubmitting}
            mt={4}
          />
        </>
      </ModalTimeBlock>}
    </Button>
  )
}
