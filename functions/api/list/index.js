export async function onRequestGet({ env }) {
  const resp = await env.LINKS.list({ prefix: 'public:' })
  .then(async (value) => {
    const links = await Promise.all(value.keys.map(async (k) => {
      const alias = k.name.slice(7)
      const url = await env.LINKS.get(k.name)
      return { alias: alias, url: url }
    }))
    return { links: links, ...(!value.list_complete && {cursor: value.cursor}) }
  })
  .catch(e => {
    console.log(e)
    return { links: [] }
  })
  console.log(resp)
  return new Response(JSON.stringify(resp))
}
