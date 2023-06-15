const MILO_HOSTNAME = 'main--milo--adobecom.hlx.live';
const ORIGIN_HOSTNAME = 'main--cmillar--auniverseaway.hlx.live';
const SUPPORT_HTML = true;

const removeHtml = (path) => {
	if (path.endsWith('/') || path.endsWith('.plain.html')) return path;

  const split = path.split('/');
  const page = split.pop();
  const [ name, ext ] = page.split('.');

  if (ext !== 'html') return path;

  split.push(name);
  return split.join('/');
};

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      url.hostname = url.pathname.startsWith('/libs')
        ? MILO_HOSTNAME
        : ORIGIN_HOSTNAME;
			if (SUPPORT_HTML) url.pathname = removeHtml(url.pathname);
			console.log(url.pathname);
      const req = new Request(url, request);
      const opts = { cf: {} };
      req.headers.set('x-forwarded-host', req.headers.get('host'));
      req.headers.set('x-byo-cdn-type', 'cloudflare');

      // Enable caching by uncommenting the next two lines.
      // req.headers.set('x-push-invalidation', 'enabled');
      // opts.cf.cacheEverything = true;

      let resp = await fetch(req, opts);
      resp = new Response(resp.body, resp);
      resp.headers.delete('age');
      resp.headers.delete('x-robots-tag');
      return resp;
    } catch(e) {
      return new Response(e.stack, { status: 500 })
    }
  }
}
