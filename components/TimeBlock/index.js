import { useState } from "react";
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import axios from 'axios'

import { Input } from '../Input'

const ModalTimeBlock = ({ isOpen, onClose, onComplete, children }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Faça sua Reserva</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {children}
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button colorScheme="blue" mr={3} onClick={onComplete}>
          Reservar horário
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)



export const TimeBlock = ({time}) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(prevState => !prevState)

  const { values, handleSubmit, handleChange, handleBlur, errors, touched, } = useFormik({
    onSubmit: () => {},
    initialValues: {
      name: '',
      email: ''
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('Preenchimento obrigatório'),
      phone: yup.string().required('Preenchimento obrigatório')
    })
  })

  return (
    <Button p={8} bg="blue.500" color="white" onClick={toggle}>
      {time}
      <ModalTimeBlock isOpen={isOpen} onClose={toggle} onComplete={handleSubmit}>
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
            onBlur={handleBlur} />
          <Input 
            label="Telefone"
            placeholder="(99) 9 9999-9999" 
            error={errors.phone}
            touched={touched.phone}
            size="lg" 
            name="phone" 
            value={values.phone} 
            onChange={handleChange} 
            onBlur={handleBlur}
            mt={4}/>
        </>
      </ModalTimeBlock>
    </Button>
  )
}
