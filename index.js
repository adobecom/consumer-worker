const MILO_HOSTNAME = 'main--milo--adobecom.hlx.live';
const ORIGIN_HOSTNAME = 'main--cmillar--auniverseaway.hlx.live';

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      url.hostname = url.pathname.startsWith('/libs')
        ? MILO_HOSTNAME
        : ORIGIN_HOSTNAME;
      const req = new Request(url, request);
      req.headers.set('x-forwarded-host', req.headers.get('host'));
      req.headers.set('x-byo-cdn-type', 'cloudflare');
      let resp = await fetch(req, {
        cf: { cacheEverything: false },
      });
      resp = new Response(resp.body, resp);
      resp.headers.delete('age');
      resp.headers.delete('x-robots-tag');
      return resp;
    } catch(e) {
      return new Response(e.stack, { status: 500 })
    }
  }
}
