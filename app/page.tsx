"use client"
import React, { useState, useRef } from 'react';
import { upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  NumberInput,
  Text,
  Paper,
  Group,
  Button,
  Stack,
  Notification
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { getFirestore, collection, addDoc } from "firebase/firestore"
import { firebaseConfig } from "../firebase"

export default function Home() {

  const database = getFirestore(firebaseConfig)
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      branch: '',
      phoneNo: 0,
    },

    validate: {
      email: (val) => (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val) ? null : 'Invalid email'),
      phoneNo: (val) => (999999999 < val && val < 10000000000 ? null : 'invalid phone number'),
    },
  });
  const [invalidPhone, setInvalidPhone] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notify, setNotify] = useState(false)
  const onSubmit = async (event: any) => {
    event.preventDefault()

    if (form.isValid()) {
      setInvalidEmail(false)
      setInvalidPhone(false)
      setLoading(true);
      const response = await addDoc(collection(database, 'vishishtpharmaceuticalidd'), form.values);
      if (response) {
        setNotify(true)
        setLoading(false)
        setTimeout(() => {
          setNotify(false)
        }, 3000);
      }
    }
    else if (!form.isValid('phoneNo')) {
      setInvalidPhone(true)
      setInvalidEmail(false)
    }
    else if (!form.isValid('email')) {
      setInvalidEmail(true)
      setInvalidPhone(false)
    }
    else {
      setInvalidEmail(true)
      setInvalidPhone(true)
    }
  }



  return (
    <main className='w-full '>
      <Paper p="xl" withBorder  >
        <Text size="lg" weight={500}>
          Fill up this Form
        </Text>
        <form onSubmit={onSubmit}>
          <Stack>

            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
              required
            />


            <TextInput
              required
              label="Email"
              placeholder="dummy.email.itbhu.ac.in"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={invalidEmail && 'Invalid email'}
              radius="md"
            />

            <TextInput
              required
              label="Branch"
              placeholder="branch"
              value={form.values.branch}
              onChange={(event) => form.setFieldValue('branch', event.currentTarget.value)}
              radius="md"
            />

            <NumberInput
              hideControls
              required
              label="Phone Number"
              placeholder="Enter your 10 digit phone number"
              onChange={(event: number) => form.setFieldValue('phoneNo', event)}
              error={invalidPhone && 'Invalid phone number'}
              radius="md"
            />

          </Stack>

          <Group position="apart" mt="xl" >
            <Button type="submit" radius="xl" className='bg-blue-500'>
              {upperFirst("submit")}
            </Button>
          </Group>
        </form>
      </Paper>
      <div className='mt-4 w-[100vw] sm:w-1/4 pl-2 pr-2' >
        {loading ? <Notification withCloseButton={false} loading color="teal" title="Uploading the data" className='bg-gray-200' /> : null}
        {notify ? <Notification icon={<IconCheck size='1.1rem' />} withCloseButton={false} color="teal" title="Registration Successfull" className='bg-gray-200' /> : null}
      </div>
    </main>
  );
}
