// reference: https://stackoverflow.com/a/1349426
function makeKey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

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

  const _alias = (isPrivate ? "private:" : "public:") + (alias || makeKey(6))
  const options = {
    metadata: { toBurn: toBurn },
    ...(expire > 0 && { expirationTtl: expire } )
  }
  const resp = await env.LINKS.put(_alias, url, options)
  .then(async () => {
    // (await env.LINKS.list()).keys.map((l) => console.log(l))
    return {
      title: 'Success',
      status: 'success',
      isClosable: true,
      ...(!isPrivate && { description: `key=${_alias.slice(7)}` })
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
  const httpCode = resp.status === 'success' ? 200 : 400
  return new Response(JSON.stringify(resp), { status: httpCode })
}

