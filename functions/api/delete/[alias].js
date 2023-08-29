export async function onRequestDelete({ request, params, env }) {
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

  const resp = await env.LINKS.delete('public:' + params.alias)
  .then(() => {
    return {
      title: 'Success',
      status: 'success',
      isClosable: true,
    }
  })
  .catch(e => {
    return {
      title: 'Failed',
      description: e.toString(),
      status: 'error',
      isClosable: true
    }
  })
  console.log(resp)
  return new Response(JSON.stringify(resp))
}

