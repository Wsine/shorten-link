async function getLink(key, env) {
  const { value, metadata } = await env.LINKS.getWithMetadata(key)
  if (value !== null) {
    if (metadata.toBurn) {
      await env.LINKS.delete(key)
    }
    return new Response(JSON.stringify({
      link: value
    }))
  }
  return null
}

export async function onRequestGet({ params, env }) {
  const resp = await getLink('private:' + params.alias, env)
            || await getLink('public:' + params.alias, env)
            || new Response("404 Not Found", { status: 404 })
  return resp
}

