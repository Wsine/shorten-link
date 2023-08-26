export async function onRequestPost({ request, env }) {
  const psk = request.headers.get('X-Custom-PSK')
  if (psk !== env.AUTH_HEADER_VALUE) {
    const resp = JSON.stringify({
      title: 'Invalid key',
      description: 'Sorry, you have supplied an invalid key.',
      status: 'warning',
      isClosable: true
    })
    return new Response(resp, { status: 403 })
  }

  const { url, alias, expire, isPrivate, toBurn } = await request.json()
  console.log(url, alias, expire, isPrivate, toBurn)

  console.log(env.LINKS)

  return new Response('whatever')
}

