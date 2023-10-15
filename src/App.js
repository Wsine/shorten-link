import { ChakraProvider } from '@chakra-ui/react'
import { AddIcon, LinkIcon, SettingsIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { AbsoluteCenter, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Container, Divider, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, List, ListIcon, ListItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Spacer, Stack, Switch, Text, VStack, useBoolean, useDisclosure, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setLoading] = useState(false)
  const [alias, setAlias] = useState(null)
  const [expire, setExpire] = useState(86400)
  const [isPrivate, setPrivate] = useBoolean(false)
  const [toBurn, setBurn] = useBoolean(false)
  const [links, setLinks] = useState([])
  const [cursor, setCursor] = useState(undefined)
  // useEffect(() => {
  //   fetch('/api/list')
  //     .then(r => r.json())
  //     .then(r => {
  //       console.log(r)
  //       setLinks(r.links)
  //       if (r.cursor) {
  //         setCursor(r.cursor)
  //       }
  //     })
  // }, [])
  const toast = useToast()

  return (
    <ChakraProvider>
      <Container pt={10} maxW={'container.md'}>
        <Stack spacing={5}>
          <Flex>
            <Heading>Link Service</Heading>
            <Spacer />
            <IconButton variant={'ghost'} icon={<SettingsIcon />} fontSize={'xl'} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Set Key</ModalHeader>
                <ModalBody>
                  <Input placeholder='X-Custom-PSK' id='psk' />
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='teal' onClick={() => {
                    const psk = document.querySelector('#psk').value.trim()
                    localStorage.setItem('psk', psk)
                    onClose()
                  }}>
                    Save
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
          <VStack spacing={1} mb={10}>
            <InputGroup>
              <InputLeftAddon children='URL' />
              <Input type='url' placeholder='https://the.url.com/that/you/want/to/shorten' autoComplete='off' />
              <InputRightAddon p={0} children={<Button isLoading={isLoading} onClick={() => {
                const url = document.querySelector('input[type=url]').value
                console.log(url)
                try {
                  new URL(url)
                } catch (e) {
                  toast({
                    title: 'Invalid URL',
                    description: e.toString(),
                    status: 'warning',
                    isClosable: true
                  })
                  return
                }
                setLoading(true)
                fetch('/api/add', {
                  method: 'post',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Custom-PSK': localStorage.getItem('psk')
                  },
                  body: JSON.stringify({
                    url: url,
                    alias: alias,
                    expire: expire,
                    isPrivate: isPrivate,
                    toBurn: toBurn
                  })
                })
                .then(r => r.json())
                .then(r => {
                    console.log(r)
                    toast(r)
                    const _alias = r.description.slice(4)
                    setLinks([...links, { alias: _alias, url: url }])
                    setLoading(false)
                })
              }}><AddIcon /></Button>}></InputRightAddon>
            </InputGroup>
            <Accordion w='100%' allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex='1' textAlign='center'>
                    Advance
                  <AccordionIcon />
                  </Box>
                </AccordionButton>
                <AccordionPanel>
                  <SimpleGrid columns={[1, 2, 4]} spacingX={10} spacingY={2}>
                    <FormControl>
                      <FormLabel>Alias</FormLabel>
                      <Input type='text' placeholder='random' autoComplete='off' maxLength={6} onChange={(e) => setAlias(e.target.value.trim())} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Expire</FormLabel>
                      <Select value={expire} onChange={(e) => setExpire(e.target.value)}>
                        <option value={3600}>1 hour</option>
                        <option value={86400}>24 hours</option>
                        <option value={259200}>3 days</option>
                        <option value={604800}>7 days</option>
                        <option value={0}>never</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Private?</FormLabel>
                      <Switch size='lg' onChange={setPrivate.toggle} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Burn after Read?</FormLabel>
                      <Switch size='lg' onChange={setBurn.toggle} />
                    </FormControl>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
          <Box position='relative' p='1'>
            <Divider />
            <AbsoluteCenter bg='white' px='4'>
              <Text fontSize={'xl'} fontWeight={'bold'}>Public</Text>
            </AbsoluteCenter>
          </Box>
          <List spacing={3}>
            {links.map((l, i) => {
              return (
                <ListItem display='flex' alignItems={'center'} key={i}>
                  <ListIcon as={LinkIcon} color='green.500' />
                  <Text bg='green.100' px={2} mr={2} minW={'80px'} textAlign={'center'}>{l.alias}</Text>
                  <a href={l.url} maxW={'80%'} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
                    {l.url}
                  </a>
                  <Spacer />
                  <ListIcon as={SmallCloseIcon} color='green.500' role='button' onClick={e => {
                    const alias = e.target.closest('li').querySelector('p').textContent
                    console.log(alias)
                    fetch(`/api/delete/${alias}`, {
                      method: 'delete',
                      headers: {
                        'X-Custom-PSK': localStorage.getItem('psk')
                      },
                    })
                    .then(r => r.json())
                    .then(r => {
                        if (r.status === 'success') {
                          setLinks(links.filter((l) => l.alias !== alias))
                        }
                        toast(r)
                    })
                  }} />
                </ListItem>
              )
            })}
          </List>
          <Button colorScheme='green' variant='ghost' display={cursor ? 'block' : 'none'} onClick={() => {
            fetch(`/api/list/${cursor}`)
              .then(r => r.json())
              .then(r => {
                console.log(r)
                setLinks(r.links)
                if (r.cursor) {
                  setCursor(r.cursor)
                } else {
                  setCursor(undefined)
                }
              })
          }}>
            Load more
          </Button>
        </Stack>
      </Container>
    </ChakraProvider>
  )
}
