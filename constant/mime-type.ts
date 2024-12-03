export type MimeType = {
  mime: string
  extensions: Array<string>
}

export type MimeTypes = Record<string, MimeType>

const MIME_TYPE: MimeTypes = {
  '123': {
    mime: 'application/vnd.lotus-1-2-3',
    extensions: ['.123'],
  },
  ez: {
    mime: 'application/andrew-inset',
    extensions: ['.ez'],
  },
  aw: {
    mime: 'application/applixware',
    extensions: ['.aw'],
  },
  atom: {
    mime: 'application/atom+xml',
    extensions: ['.atom'],
  },
  atomcat: {
    mime: 'application/atomcat+xml',
    extensions: ['.atomcat'],
  },
  atomdeleted: {
    mime: 'application/atomdeleted+xml',
    extensions: ['.atomdeleted'],
  },
  atomsvc: {
    mime: 'application/atomsvc+xml',
    extensions: ['.atomsvc'],
  },
  dwd: {
    mime: 'application/atsc-dwd+xml',
    extensions: ['.dwd'],
  },
  held: {
    mime: 'application/atsc-held+xml',
    extensions: ['.held'],
  },
  rsat: {
    mime: 'application/atsc-rsat+xml',
    extensions: ['.rsat'],
  },
  bdoc: {
    mime: 'application/bdoc',
    extensions: ['.bdoc'],
  },
  xcs: {
    mime: 'application/calendar+xml',
    extensions: ['.xcs'],
  },
  ccxml: {
    mime: 'application/ccxml+xml',
    extensions: ['.ccxml'],
  },
  cdfx: {
    mime: 'application/cdfx+xml',
    extensions: ['.cdfx'],
  },
  cdmia: {
    mime: 'application/cdmi-capability',
    extensions: ['.cdmia'],
  },
  cdmic: {
    mime: 'application/cdmi-container',
    extensions: ['.cdmic'],
  },
  cdmid: {
    mime: 'application/cdmi-domain',
    extensions: ['.cdmid'],
  },
  cdmio: {
    mime: 'application/cdmi-object',
    extensions: ['.cdmio'],
  },
  cdmiq: {
    mime: 'application/cdmi-queue',
    extensions: ['.cdmiq'],
  },
  cpl: {
    mime: 'application/cpl+xml',
    extensions: ['.cpl'],
  },
  cu: {
    mime: 'application/cu-seeme',
    extensions: ['.cu'],
  },
  mpd: {
    mime: 'application/dash+xml',
    extensions: ['.mpd'],
  },
  mpp: {
    mime: 'application/dash-patch+xml',
    extensions: ['.mpp'],
  },
  davmount: {
    mime: 'application/davmount+xml',
    extensions: ['.davmount'],
  },
  dbk: {
    mime: 'application/docbook+xml',
    extensions: ['.dbk'],
  },
  dssc: {
    mime: 'application/dssc+der',
    extensions: ['.dssc'],
  },
  xdssc: {
    mime: 'application/dssc+xml',
    extensions: ['.xdssc'],
  },
  es: {
    mime: 'application/ecmascript',
    extensions: ['.es', '.ecma'],
  },
  ecma: {
    mime: 'application/ecmascript',
    extensions: ['.es', '.ecma'],
  },
  emma: {
    mime: 'application/emma+xml',
    extensions: ['.emma'],
  },
  emotionml: {
    mime: 'application/emotionml+xml',
    extensions: ['.emotionml'],
  },
  epub: {
    mime: 'application/epub+zip',
    extensions: ['.epub'],
  },
  exi: {
    mime: 'application/exi',
    extensions: ['.exi'],
  },
  exp: {
    mime: 'application/express',
    extensions: ['.exp'],
  },
  fdt: {
    mime: 'application/fdt+xml',
    extensions: ['.fdt'],
  },
  pfr: {
    mime: 'application/font-tdpfr',
    extensions: ['.pfr'],
  },
  geojson: {
    mime: 'application/geo+json',
    extensions: ['.geojson'],
  },
  gml: {
    mime: 'application/gml+xml',
    extensions: ['.gml'],
  },
  gpx: {
    mime: 'application/gpx+xml',
    extensions: ['.gpx'],
  },
  gxf: {
    mime: 'application/gxf',
    extensions: ['.gxf'],
  },
  gz: {
    mime: 'application/gzip',
    extensions: ['.gz'],
  },
  hjson: {
    mime: 'application/hjson',
    extensions: ['.hjson'],
  },
  stk: {
    mime: 'application/hyperstudio',
    extensions: ['.stk'],
  },
  ink: {
    mime: 'application/inkml+xml',
    extensions: ['.ink', '.inkml'],
  },
  inkml: {
    mime: 'application/inkml+xml',
    extensions: ['.ink', '.inkml'],
  },
  ipfix: {
    mime: 'application/ipfix',
    extensions: ['.ipfix'],
  },
  its: {
    mime: 'application/its+xml',
    extensions: ['.its'],
  },
  jar: {
    mime: 'application/java-archive',
    extensions: ['.jar', '.war', '.ear'],
  },
  war: {
    mime: 'application/java-archive',
    extensions: ['.jar', '.war', '.ear'],
  },
  ear: {
    mime: 'application/java-archive',
    extensions: ['.jar', '.war', '.ear'],
  },
  ser: {
    mime: 'application/java-serialized-object',
    extensions: ['.ser'],
  },
  class: {
    mime: 'application/java-vm',
    extensions: ['.class'],
  },
  js: {
    mime: 'application/javascript',
    extensions: ['.js', '.mjs'],
  },
  mjs: {
    mime: 'application/javascript',
    extensions: ['.js', '.mjs'],
  },
  json: {
    mime: 'application/json',
    extensions: ['.json', '.map'],
  },
  map: {
    mime: 'application/json',
    extensions: ['.json', '.map'],
  },
  json5: {
    mime: 'application/json5',
    extensions: ['.json5'],
  },
  jsonml: {
    mime: 'application/jsonml+json',
    extensions: ['.jsonml'],
  },
  jsonld: {
    mime: 'application/ld+json',
    extensions: ['.jsonld'],
  },
  lgr: {
    mime: 'application/lgr+xml',
    extensions: ['.lgr'],
  },
  lostxml: {
    mime: 'application/lost+xml',
    extensions: ['.lostxml'],
  },
  hqx: {
    mime: 'application/mac-binhex40',
    extensions: ['.hqx'],
  },
  cpt: {
    mime: 'application/mac-compactpro',
    extensions: ['.cpt'],
  },
  mads: {
    mime: 'application/mads+xml',
    extensions: ['.mads'],
  },
  webmanifest: {
    mime: 'application/manifest+json',
    extensions: ['.webmanifest'],
  },
  mrc: {
    mime: 'application/marc',
    extensions: ['.mrc'],
  },
  mrcx: {
    mime: 'application/marcxml+xml',
    extensions: ['.mrcx'],
  },
  ma: {
    mime: 'application/mathematica',
    extensions: ['.ma', '.nb', '.mb'],
  },
  nb: {
    mime: 'application/mathematica',
    extensions: ['.ma', '.nb', '.mb'],
  },
  mb: {
    mime: 'application/mathematica',
    extensions: ['.ma', '.nb', '.mb'],
  },
  mathml: {
    mime: 'application/mathml+xml',
    extensions: ['.mathml'],
  },
  mbox: {
    mime: 'application/mbox',
    extensions: ['.mbox'],
  },
  mpf: {
    mime: 'application/media-policy-dataset+xml',
    extensions: ['.mpf'],
  },
  mscml: {
    mime: 'application/mediaservercontrol+xml',
    extensions: ['.mscml'],
  },
  metalink: {
    mime: 'application/metalink+xml',
    extensions: ['.metalink'],
  },
  meta4: {
    mime: 'application/metalink4+xml',
    extensions: ['.meta4'],
  },
  mets: {
    mime: 'application/mets+xml',
    extensions: ['.mets'],
  },
  maei: {
    mime: 'application/mmt-aei+xml',
    extensions: ['.maei'],
  },
  musd: {
    mime: 'application/mmt-usd+xml',
    extensions: ['.musd'],
  },
  mods: {
    mime: 'application/mods+xml',
    extensions: ['.mods'],
  },
  m21: {
    mime: 'application/mp21',
    extensions: ['.m21', '.mp21'],
  },
  mp21: {
    mime: 'application/mp21',
    extensions: ['.m21', '.mp21'],
  },
  mp4s: {
    mime: 'application/mp4',
    extensions: ['.mp4s', '.m4p'],
  },
  m4p: {
    mime: 'application/mp4',
    extensions: ['.mp4s', '.m4p'],
  },
  doc: {
    mime: 'application/msword',
    extensions: ['.doc', '.dot'],
  },
  dot: {
    mime: 'application/msword',
    extensions: ['.doc', '.dot'],
  },
  mxf: {
    mime: 'application/mxf',
    extensions: ['.mxf'],
  },
  nq: {
    mime: 'application/n-quads',
    extensions: ['.nq'],
  },
  nt: {
    mime: 'application/n-triples',
    extensions: ['.nt'],
  },
  cjs: {
    mime: 'application/node',
    extensions: ['.cjs'],
  },
  bin: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  dms: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  lrf: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  mar: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  so: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  dist: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  distz: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  pkg: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  bpk: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  dump: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  elc: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  deploy: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  exe: {
    mime: 'application/x-msdos-program',
    extensions: ['.exe'],
  },
  dll: {
    mime: 'application/x-msdownload',
    extensions: ['.exe', '.dll', '.com', '.bat', '.msi'],
  },
  deb: {
    mime: 'application/x-debian-package',
    extensions: ['.deb', '.udeb'],
  },
  dmg: {
    mime: 'application/x-apple-diskimage',
    extensions: ['.dmg'],
  },
  iso: {
    mime: 'application/x-iso9660-image',
    extensions: ['.iso'],
  },
  img: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  msi: {
    mime: 'application/x-msdownload',
    extensions: ['.exe', '.dll', '.com', '.bat', '.msi'],
  },
  msp: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  msm: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  buffer: {
    mime: 'application/octet-stream',
    extensions: [
      '.bin',
      '.dms',
      '.lrf',
      '.mar',
      '.so',
      '.dist',
      '.distz',
      '.pkg',
      '.bpk',
      '.dump',
      '.elc',
      '.deploy',
      '.exe',
      '.dll',
      '.deb',
      '.dmg',
      '.iso',
      '.img',
      '.msi',
      '.msp',
      '.msm',
      '.buffer',
    ],
  },
  oda: {
    mime: 'application/oda',
    extensions: ['.oda'],
  },
  opf: {
    mime: 'application/oebps-package+xml',
    extensions: ['.opf'],
  },
  ogx: {
    mime: 'application/ogg',
    extensions: ['.ogx'],
  },
  omdoc: {
    mime: 'application/omdoc+xml',
    extensions: ['.omdoc'],
  },
  onetoc: {
    mime: 'application/onenote',
    extensions: ['.onetoc', '.onetoc2', '.onetmp', '.onepkg'],
  },
  onetoc2: {
    mime: 'application/onenote',
    extensions: ['.onetoc', '.onetoc2', '.onetmp', '.onepkg'],
  },
  onetmp: {
    mime: 'application/onenote',
    extensions: ['.onetoc', '.onetoc2', '.onetmp', '.onepkg'],
  },
  onepkg: {
    mime: 'application/onenote',
    extensions: ['.onetoc', '.onetoc2', '.onetmp', '.onepkg'],
  },
  oxps: {
    mime: 'application/oxps',
    extensions: ['.oxps'],
  },
  relo: {
    mime: 'application/p2p-overlay+xml',
    extensions: ['.relo'],
  },
  xer: {
    mime: 'application/patch-ops-error+xml',
    extensions: ['.xer'],
  },
  pdf: {
    mime: 'application/pdf',
    extensions: ['.pdf'],
  },
  pgp: {
    mime: 'application/pgp-encrypted',
    extensions: ['.pgp'],
  },
  asc: {
    mime: 'application/pgp-keys',
    extensions: ['.asc'],
  },
  sig: {
    mime: 'application/pgp-signature',
    extensions: ['.asc', '.sig'],
  },
  prf: {
    mime: 'application/pics-rules',
    extensions: ['.prf'],
  },
  p10: {
    mime: 'application/pkcs10',
    extensions: ['.p10'],
  },
  p7m: {
    mime: 'application/pkcs7-mime',
    extensions: ['.p7m', '.p7c'],
  },
  p7c: {
    mime: 'application/pkcs7-mime',
    extensions: ['.p7m', '.p7c'],
  },
  p7s: {
    mime: 'application/pkcs7-signature',
    extensions: ['.p7s'],
  },
  p8: {
    mime: 'application/pkcs8',
    extensions: ['.p8'],
  },
  ac: {
    mime: 'application/pkix-attr-cert',
    extensions: ['.ac'],
  },
  cer: {
    mime: 'application/pkix-cert',
    extensions: ['.cer'],
  },
  crl: {
    mime: 'application/pkix-crl',
    extensions: ['.crl'],
  },
  pkipath: {
    mime: 'application/pkix-pkipath',
    extensions: ['.pkipath'],
  },
  pki: {
    mime: 'application/pkixcmp',
    extensions: ['.pki'],
  },
  pls: {
    mime: 'application/pls+xml',
    extensions: ['.pls'],
  },
  ai: {
    mime: 'application/postscript',
    extensions: ['.ai', '.eps', '.ps'],
  },
  eps: {
    mime: 'application/postscript',
    extensions: ['.ai', '.eps', '.ps'],
  },
  ps: {
    mime: 'application/postscript',
    extensions: ['.ai', '.eps', '.ps'],
  },
  provx: {
    mime: 'application/provenance+xml',
    extensions: ['.provx'],
  },
  cww: {
    mime: 'application/prs.cww',
    extensions: ['.cww'],
  },
  pskcxml: {
    mime: 'application/pskc+xml',
    extensions: ['.pskcxml'],
  },
  raml: {
    mime: 'application/raml+yaml',
    extensions: ['.raml'],
  },
  rdf: {
    mime: 'application/rdf+xml',
    extensions: ['.rdf', '.owl'],
  },
  owl: {
    mime: 'application/rdf+xml',
    extensions: ['.rdf', '.owl'],
  },
  rif: {
    mime: 'application/reginfo+xml',
    extensions: ['.rif'],
  },
  rnc: {
    mime: 'application/relax-ng-compact-syntax',
    extensions: ['.rnc'],
  },
  rl: {
    mime: 'application/resource-lists+xml',
    extensions: ['.rl'],
  },
  rld: {
    mime: 'application/resource-lists-diff+xml',
    extensions: ['.rld'],
  },
  rs: {
    mime: 'application/rls-services+xml',
    extensions: ['.rs'],
  },
  rapd: {
    mime: 'application/route-apd+xml',
    extensions: ['.rapd'],
  },
  sls: {
    mime: 'application/route-s-tsid+xml',
    extensions: ['.sls'],
  },
  rusd: {
    mime: 'application/route-usd+xml',
    extensions: ['.rusd'],
  },
  gbr: {
    mime: 'application/rpki-ghostbusters',
    extensions: ['.gbr'],
  },
  mft: {
    mime: 'application/rpki-manifest',
    extensions: ['.mft'],
  },
  roa: {
    mime: 'application/rpki-roa',
    extensions: ['.roa'],
  },
  rsd: {
    mime: 'application/rsd+xml',
    extensions: ['.rsd'],
  },
  rss: {
    mime: 'application/rss+xml',
    extensions: ['.rss'],
  },
  rtf: {
    mime: 'application/rtf',
    extensions: ['.rtf'],
  },
  sbml: {
    mime: 'application/sbml+xml',
    extensions: ['.sbml'],
  },
  scq: {
    mime: 'application/scvp-cv-request',
    extensions: ['.scq'],
  },
  scs: {
    mime: 'application/scvp-cv-response',
    extensions: ['.scs'],
  },
  spq: {
    mime: 'application/scvp-vp-request',
    extensions: ['.spq'],
  },
  spp: {
    mime: 'application/scvp-vp-response',
    extensions: ['.spp'],
  },
  sdp: {
    mime: 'application/sdp',
    extensions: ['.sdp'],
  },
  senmlx: {
    mime: 'application/senml+xml',
    extensions: ['.senmlx'],
  },
  sensmlx: {
    mime: 'application/sensml+xml',
    extensions: ['.sensmlx'],
  },
  setpay: {
    mime: 'application/set-payment-initiation',
    extensions: ['.setpay'],
  },
  setreg: {
    mime: 'application/set-registration-initiation',
    extensions: ['.setreg'],
  },
  shf: {
    mime: 'application/shf+xml',
    extensions: ['.shf'],
  },
  siv: {
    mime: 'application/sieve',
    extensions: ['.siv', '.sieve'],
  },
  sieve: {
    mime: 'application/sieve',
    extensions: ['.siv', '.sieve'],
  },
  smi: {
    mime: 'application/smil+xml',
    extensions: ['.smi', '.smil'],
  },
  smil: {
    mime: 'application/smil+xml',
    extensions: ['.smi', '.smil'],
  },
  rq: {
    mime: 'application/sparql-query',
    extensions: ['.rq'],
  },
  srx: {
    mime: 'application/sparql-results+xml',
    extensions: ['.srx'],
  },
  gram: {
    mime: 'application/srgs',
    extensions: ['.gram'],
  },
  grxml: {
    mime: 'application/srgs+xml',
    extensions: ['.grxml'],
  },
  sru: {
    mime: 'application/sru+xml',
    extensions: ['.sru'],
  },
  ssdl: {
    mime: 'application/ssdl+xml',
    extensions: ['.ssdl'],
  },
  ssml: {
    mime: 'application/ssml+xml',
    extensions: ['.ssml'],
  },
  swidtag: {
    mime: 'application/swid+xml',
    extensions: ['.swidtag'],
  },
  tei: {
    mime: 'application/tei+xml',
    extensions: ['.tei', '.teicorpus'],
  },
  teicorpus: {
    mime: 'application/tei+xml',
    extensions: ['.tei', '.teicorpus'],
  },
  tfi: {
    mime: 'application/thraud+xml',
    extensions: ['.tfi'],
  },
  tsd: {
    mime: 'application/timestamped-data',
    extensions: ['.tsd'],
  },
  toml: {
    mime: 'application/toml',
    extensions: ['.toml'],
  },
  trig: {
    mime: 'application/trig',
    extensions: ['.trig'],
  },
  ttml: {
    mime: 'application/ttml+xml',
    extensions: ['.ttml'],
  },
  ubj: {
    mime: 'application/ubjson',
    extensions: ['.ubj'],
  },
  rsheet: {
    mime: 'application/urc-ressheet+xml',
    extensions: ['.rsheet'],
  },
  td: {
    mime: 'application/urc-targetdesc+xml',
    extensions: ['.td'],
  },
  '1km': {
    mime: 'application/vnd.1000minds.decision-model+xml',
    extensions: ['.1km'],
  },
  plb: {
    mime: 'application/vnd.3gpp.pic-bw-large',
    extensions: ['.plb'],
  },
  psb: {
    mime: 'application/vnd.3gpp.pic-bw-small',
    extensions: ['.psb'],
  },
  pvb: {
    mime: 'application/vnd.3gpp.pic-bw-var',
    extensions: ['.pvb'],
  },
  tcap: {
    mime: 'application/vnd.3gpp2.tcap',
    extensions: ['.tcap'],
  },
  pwn: {
    mime: 'application/vnd.3m.post-it-notes',
    extensions: ['.pwn'],
  },
  aso: {
    mime: 'application/vnd.accpac.simply.aso',
    extensions: ['.aso'],
  },
  imp: {
    mime: 'application/vnd.accpac.simply.imp',
    extensions: ['.imp'],
  },
  acu: {
    mime: 'application/vnd.acucobol',
    extensions: ['.acu'],
  },
  atc: {
    mime: 'application/vnd.acucorp',
    extensions: ['.atc', '.acutc'],
  },
  acutc: {
    mime: 'application/vnd.acucorp',
    extensions: ['.atc', '.acutc'],
  },
  air: {
    mime: 'application/vnd.adobe.air-application-installer-package+zip',
    extensions: ['.air'],
  },
  fcdt: {
    mime: 'application/vnd.adobe.formscentral.fcdt',
    extensions: ['.fcdt'],
  },
  fxp: {
    mime: 'application/vnd.adobe.fxp',
    extensions: ['.fxp', '.fxpl'],
  },
  fxpl: {
    mime: 'application/vnd.adobe.fxp',
    extensions: ['.fxp', '.fxpl'],
  },
  xdp: {
    mime: 'application/vnd.adobe.xdp+xml',
    extensions: ['.xdp'],
  },
  xfdf: {
    mime: 'application/vnd.adobe.xfdf',
    extensions: ['.xfdf'],
  },
  age: {
    mime: 'application/vnd.age',
    extensions: ['.age'],
  },
  ahead: {
    mime: 'application/vnd.ahead.space',
    extensions: ['.ahead'],
  },
  azf: {
    mime: 'application/vnd.airzip.filesecure.azf',
    extensions: ['.azf'],
  },
  azs: {
    mime: 'application/vnd.airzip.filesecure.azs',
    extensions: ['.azs'],
  },
  azw: {
    mime: 'application/vnd.amazon.ebook',
    extensions: ['.azw'],
  },
  acc: {
    mime: 'application/vnd.americandynamics.acc',
    extensions: ['.acc'],
  },
  ami: {
    mime: 'application/vnd.amiga.ami',
    extensions: ['.ami'],
  },
  apk: {
    mime: 'application/vnd.android.package-archive',
    extensions: ['.apk'],
  },
  cii: {
    mime: 'application/vnd.anser-web-certificate-issue-initiation',
    extensions: ['.cii'],
  },
  fti: {
    mime: 'application/vnd.anser-web-funds-transfer-initiation',
    extensions: ['.fti'],
  },
  atx: {
    mime: 'application/vnd.antix.game-component',
    extensions: ['.atx'],
  },
  mpkg: {
    mime: 'application/vnd.apple.installer+xml',
    extensions: ['.mpkg'],
  },
  key: {
    mime: 'application/vnd.apple.keynote',
    extensions: ['.key'],
  },
  m3u8: {
    mime: 'application/vnd.apple.mpegurl',
    extensions: ['.m3u8'],
  },
  numbers: {
    mime: 'application/vnd.apple.numbers',
    extensions: ['.numbers'],
  },
  pages: {
    mime: 'application/vnd.apple.pages',
    extensions: ['.pages'],
  },
  pkpass: {
    mime: 'application/vnd.apple.pkpass',
    extensions: ['.pkpass'],
  },
  swi: {
    mime: 'application/vnd.aristanetworks.swi',
    extensions: ['.swi'],
  },
  iota: {
    mime: 'application/vnd.astraea-software.iota',
    extensions: ['.iota'],
  },
  aep: {
    mime: 'application/vnd.audiograph',
    extensions: ['.aep'],
  },
  bmml: {
    mime: 'application/vnd.balsamiq.bmml+xml',
    extensions: ['.bmml'],
  },
  mpm: {
    mime: 'application/vnd.blueice.multipass',
    extensions: ['.mpm'],
  },
  bmi: {
    mime: 'application/vnd.bmi',
    extensions: ['.bmi'],
  },
  raw: {
    mime: 'image/x-canon-cr2',
    extensions: ['.raw', '.cr2'],
  },
  cr2: {
    mime: 'image/x-canon-cr2',
    extensions: ['.raw', '.cr2'],
  },
  rep: {
    mime: 'application/vnd.businessobjects',
    extensions: ['.rep'],
  },
  cdxml: {
    mime: 'application/vnd.chemdraw+xml',
    extensions: ['.cdxml'],
  },
  mmd: {
    mime: 'application/vnd.chipnuts.karaoke-mmd',
    extensions: ['.mmd'],
  },
  cdy: {
    mime: 'application/vnd.cinderella',
    extensions: ['.cdy'],
  },
  csl: {
    mime: 'application/vnd.citationstyles.style+xml',
    extensions: ['.csl'],
  },
  cla: {
    mime: 'application/vnd.claymore',
    extensions: ['.cla'],
  },
  rp9: {
    mime: 'application/vnd.cloanto.rp9',
    extensions: ['.rp9'],
  },
  c4g: {
    mime: 'application/vnd.clonk.c4group',
    extensions: ['.c4g', '.c4d', '.c4f', '.c4p', '.c4u'],
  },
  c4d: {
    mime: 'application/vnd.clonk.c4group',
    extensions: ['.c4g', '.c4d', '.c4f', '.c4p', '.c4u'],
  },
  c4f: {
    mime: 'application/vnd.clonk.c4group',
    extensions: ['.c4g', '.c4d', '.c4f', '.c4p', '.c4u'],
  },
  c4p: {
    mime: 'application/vnd.clonk.c4group',
    extensions: ['.c4g', '.c4d', '.c4f', '.c4p', '.c4u'],
  },
  c4u: {
    mime: 'application/vnd.clonk.c4group',
    extensions: ['.c4g', '.c4d', '.c4f', '.c4p', '.c4u'],
  },
  c11amc: {
    mime: 'application/vnd.cluetrust.cartomobile-config',
    extensions: ['.c11amc'],
  },
  c11amz: {
    mime: 'application/vnd.cluetrust.cartomobile-config-pkg',
    extensions: ['.c11amz'],
  },
  csp: {
    mime: 'application/vnd.commonspace',
    extensions: ['.csp'],
  },
  cdbcmsg: {
    mime: 'application/vnd.contact.cmsg',
    extensions: ['.cdbcmsg'],
  },
  cmc: {
    mime: 'application/vnd.cosmocaller',
    extensions: ['.cmc'],
  },
  clkx: {
    mime: 'application/vnd.crick.clicker',
    extensions: ['.clkx'],
  },
  clkk: {
    mime: 'application/vnd.crick.clicker.keyboard',
    extensions: ['.clkk'],
  },
  clkp: {
    mime: 'application/vnd.crick.clicker.palette',
    extensions: ['.clkp'],
  },
  clkt: {
    mime: 'application/vnd.crick.clicker.template',
    extensions: ['.clkt'],
  },
  clkw: {
    mime: 'application/vnd.crick.clicker.wordbank',
    extensions: ['.clkw'],
  },
  wbs: {
    mime: 'application/vnd.criticaltools.wbs+xml',
    extensions: ['.wbs'],
  },
  pml: {
    mime: 'application/vnd.ctc-posml',
    extensions: ['.pml'],
  },
  ppd: {
    mime: 'application/vnd.cups-ppd',
    extensions: ['.ppd'],
  },
  car: {
    mime: 'application/vnd.curl.car',
    extensions: ['.car'],
  },
  pcurl: {
    mime: 'application/vnd.curl.pcurl',
    extensions: ['.pcurl'],
  },
  dart: {
    mime: 'application/vnd.dart',
    extensions: ['.dart'],
  },
  rdz: {
    mime: 'application/vnd.data-vision.rdz',
    extensions: ['.rdz'],
  },
  dbf: {
    mime: 'application/vnd.dbf',
    extensions: ['.dbf'],
  },
  uvf: {
    mime: 'application/vnd.dece.data',
    extensions: ['.uvf', '.uvvf', '.uvd', '.uvvd'],
  },
  uvvf: {
    mime: 'application/vnd.dece.data',
    extensions: ['.uvf', '.uvvf', '.uvd', '.uvvd'],
  },
  uvd: {
    mime: 'application/vnd.dece.data',
    extensions: ['.uvf', '.uvvf', '.uvd', '.uvvd'],
  },
  uvvd: {
    mime: 'application/vnd.dece.data',
    extensions: ['.uvf', '.uvvf', '.uvd', '.uvvd'],
  },
  uvt: {
    mime: 'application/vnd.dece.ttml+xml',
    extensions: ['.uvt', '.uvvt'],
  },
  uvvt: {
    mime: 'application/vnd.dece.ttml+xml',
    extensions: ['.uvt', '.uvvt'],
  },
  uvx: {
    mime: 'application/vnd.dece.unspecified',
    extensions: ['.uvx', '.uvvx'],
  },
  uvvx: {
    mime: 'application/vnd.dece.unspecified',
    extensions: ['.uvx', '.uvvx'],
  },
  uvz: {
    mime: 'application/vnd.dece.zip',
    extensions: ['.uvz', '.uvvz'],
  },
  uvvz: {
    mime: 'application/vnd.dece.zip',
    extensions: ['.uvz', '.uvvz'],
  },
  fe_launch: {
    mime: 'application/vnd.denovo.fcselayout-link',
    extensions: ['.fe_launch'],
  },
  dna: {
    mime: 'application/vnd.dna',
    extensions: ['.dna'],
  },
  mlp: {
    mime: 'application/vnd.dolby.mlp',
    extensions: ['.mlp'],
  },
  dpg: {
    mime: 'application/vnd.dpgraph',
    extensions: ['.dpg'],
  },
  dfac: {
    mime: 'application/vnd.dreamfactory',
    extensions: ['.dfac'],
  },
  kpxx: {
    mime: 'application/vnd.ds-keypoint',
    extensions: ['.kpxx'],
  },
  ait: {
    mime: 'application/vnd.dvb.ait',
    extensions: ['.ait'],
  },
  svc: {
    mime: 'application/vnd.dvb.service',
    extensions: ['.svc'],
  },
  geo: {
    mime: 'application/vnd.dynageo',
    extensions: ['.geo'],
  },
  mag: {
    mime: 'application/vnd.ecowin.chart',
    extensions: ['.mag'],
  },
  nml: {
    mime: 'application/vnd.enliven',
    extensions: ['.nml'],
  },
  esf: {
    mime: 'application/vnd.epson.esf',
    extensions: ['.esf'],
  },
  msf: {
    mime: 'application/vnd.epson.msf',
    extensions: ['.msf'],
  },
  qam: {
    mime: 'application/vnd.epson.quickanime',
    extensions: ['.qam'],
  },
  slt: {
    mime: 'application/vnd.epson.salt',
    extensions: ['.slt'],
  },
  ssf: {
    mime: 'application/vnd.epson.ssf',
    extensions: ['.ssf'],
  },
  es3: {
    mime: 'application/vnd.eszigno3+xml',
    extensions: ['.es3', '.et3'],
  },
  et3: {
    mime: 'application/vnd.eszigno3+xml',
    extensions: ['.es3', '.et3'],
  },
  ez2: {
    mime: 'application/vnd.ezpix-album',
    extensions: ['.ez2'],
  },
  ez3: {
    mime: 'application/vnd.ezpix-package',
    extensions: ['.ez3'],
  },
  fdf: {
    mime: 'application/vnd.fdf',
    extensions: ['.fdf'],
  },
  mseed: {
    mime: 'application/vnd.fdsn.mseed',
    extensions: ['.mseed'],
  },
  seed: {
    mime: 'application/vnd.fdsn.seed',
    extensions: ['.seed', '.dataless'],
  },
  dataless: {
    mime: 'application/vnd.fdsn.seed',
    extensions: ['.seed', '.dataless'],
  },
  gph: {
    mime: 'application/vnd.flographit',
    extensions: ['.gph'],
  },
  ftc: {
    mime: 'application/vnd.fluxtime.clip',
    extensions: ['.ftc'],
  },
  fm: {
    mime: 'application/vnd.framemaker',
    extensions: ['.fm', '.frame', '.maker', '.book'],
  },
  frame: {
    mime: 'application/vnd.framemaker',
    extensions: ['.fm', '.frame', '.maker', '.book'],
  },
  maker: {
    mime: 'application/vnd.framemaker',
    extensions: ['.fm', '.frame', '.maker', '.book'],
  },
  book: {
    mime: 'application/vnd.framemaker',
    extensions: ['.fm', '.frame', '.maker', '.book'],
  },
  fnc: {
    mime: 'application/vnd.frogans.fnc',
    extensions: ['.fnc'],
  },
  ltf: {
    mime: 'application/vnd.frogans.ltf',
    extensions: ['.ltf'],
  },
  fsc: {
    mime: 'application/vnd.fsc.weblaunch',
    extensions: ['.fsc'],
  },
  oas: {
    mime: 'application/vnd.fujitsu.oasys',
    extensions: ['.oas'],
  },
  oa2: {
    mime: 'application/vnd.fujitsu.oasys2',
    extensions: ['.oa2'],
  },
  oa3: {
    mime: 'application/vnd.fujitsu.oasys3',
    extensions: ['.oa3'],
  },
  fg5: {
    mime: 'application/vnd.fujitsu.oasysgp',
    extensions: ['.fg5'],
  },
  bh2: {
    mime: 'application/vnd.fujitsu.oasysprs',
    extensions: ['.bh2'],
  },
  ddd: {
    mime: 'application/vnd.fujixerox.ddd',
    extensions: ['.ddd'],
  },
  xdw: {
    mime: 'application/vnd.fujixerox.docuworks',
    extensions: ['.xdw'],
  },
  xbd: {
    mime: 'application/vnd.fujixerox.docuworks.binder',
    extensions: ['.xbd'],
  },
  fzs: {
    mime: 'application/vnd.fuzzysheet',
    extensions: ['.fzs'],
  },
  txd: {
    mime: 'application/vnd.genomatix.tuxedo',
    extensions: ['.txd'],
  },
  ggb: {
    mime: 'application/vnd.geogebra.file',
    extensions: ['.ggb'],
  },
  ggt: {
    mime: 'application/vnd.geogebra.tool',
    extensions: ['.ggt'],
  },
  gex: {
    mime: 'application/vnd.geometry-explorer',
    extensions: ['.gex', '.gre'],
  },
  gre: {
    mime: 'application/vnd.geometry-explorer',
    extensions: ['.gex', '.gre'],
  },
  gxt: {
    mime: 'application/vnd.geonext',
    extensions: ['.gxt'],
  },
  g2w: {
    mime: 'application/vnd.geoplan',
    extensions: ['.g2w'],
  },
  g3w: {
    mime: 'application/vnd.geospace',
    extensions: ['.g3w'],
  },
  gmx: {
    mime: 'application/vnd.gmx',
    extensions: ['.gmx'],
  },
  gdoc: {
    mime: 'application/vnd.google-apps.document',
    extensions: ['.gdoc'],
  },
  gslides: {
    mime: 'application/vnd.google-apps.presentation',
    extensions: ['.gslides'],
  },
  gsheet: {
    mime: 'application/vnd.google-apps.spreadsheet',
    extensions: ['.gsheet'],
  },
  kml: {
    mime: 'application/vnd.google-earth.kml+xml',
    extensions: ['.kml'],
  },
  kmz: {
    mime: 'application/vnd.google-earth.kmz',
    extensions: ['.kmz'],
  },
  gqf: {
    mime: 'application/vnd.grafeq',
    extensions: ['.gqf', '.gqs'],
  },
  gqs: {
    mime: 'application/vnd.grafeq',
    extensions: ['.gqf', '.gqs'],
  },
  gac: {
    mime: 'application/vnd.groove-account',
    extensions: ['.gac'],
  },
  ghf: {
    mime: 'application/vnd.groove-help',
    extensions: ['.ghf'],
  },
  gim: {
    mime: 'application/vnd.groove-identity-message',
    extensions: ['.gim'],
  },
  grv: {
    mime: 'application/vnd.groove-injector',
    extensions: ['.grv'],
  },
  gtm: {
    mime: 'application/vnd.groove-tool-message',
    extensions: ['.gtm'],
  },
  tpl: {
    mime: 'application/vnd.groove-tool-template',
    extensions: ['.tpl'],
  },
  vcg: {
    mime: 'application/vnd.groove-vcard',
    extensions: ['.vcg'],
  },
  hal: {
    mime: 'application/vnd.hal+xml',
    extensions: ['.hal'],
  },
  zmm: {
    mime: 'application/vnd.handheld-entertainment+xml',
    extensions: ['.zmm'],
  },
  hbci: {
    mime: 'application/vnd.hbci',
    extensions: ['.hbci'],
  },
  les: {
    mime: 'application/vnd.hhe.lesson-player',
    extensions: ['.les'],
  },
  hpgl: {
    mime: 'application/vnd.hp-hpgl',
    extensions: ['.hpgl'],
  },
  hpid: {
    mime: 'application/vnd.hp-hpid',
    extensions: ['.hpid'],
  },
  hps: {
    mime: 'application/vnd.hp-hps',
    extensions: ['.hps'],
  },
  jlt: {
    mime: 'application/vnd.hp-jlyt',
    extensions: ['.jlt'],
  },
  pcl: {
    mime: 'application/vnd.hp-pcl',
    extensions: ['.pcl'],
  },
  pclxl: {
    mime: 'application/vnd.hp-pclxl',
    extensions: ['.pclxl'],
  },
  'sfd-hdstx': {
    mime: 'application/vnd.hydrostatix.sof-data',
    extensions: ['.sfd-hdstx'],
  },
  mpy: {
    mime: 'application/vnd.ibm.minipay',
    extensions: ['.mpy'],
  },
  afp: {
    mime: 'application/vnd.ibm.modcap',
    extensions: ['.afp', '.listafp', '.list3820'],
  },
  listafp: {
    mime: 'application/vnd.ibm.modcap',
    extensions: ['.afp', '.listafp', '.list3820'],
  },
  list3820: {
    mime: 'application/vnd.ibm.modcap',
    extensions: ['.afp', '.listafp', '.list3820'],
  },
  irm: {
    mime: 'application/vnd.ibm.rights-management',
    extensions: ['.irm'],
  },
  sc: {
    mime: 'application/vnd.ibm.secure-container',
    extensions: ['.sc'],
  },
  icc: {
    mime: 'application/vnd.iccprofile',
    extensions: ['.icc', '.icm'],
  },
  icm: {
    mime: 'application/vnd.iccprofile',
    extensions: ['.icc', '.icm'],
  },
  igl: {
    mime: 'application/vnd.igloader',
    extensions: ['.igl'],
  },
  ivp: {
    mime: 'application/vnd.immervision-ivp',
    extensions: ['.ivp'],
  },
  ivu: {
    mime: 'application/vnd.immervision-ivu',
    extensions: ['.ivu'],
  },
  igm: {
    mime: 'application/vnd.insors.igm',
    extensions: ['.igm'],
  },
  xpw: {
    mime: 'application/vnd.intercon.formnet',
    extensions: ['.xpw', '.xpx'],
  },
  xpx: {
    mime: 'application/vnd.intercon.formnet',
    extensions: ['.xpw', '.xpx'],
  },
  i2g: {
    mime: 'application/vnd.intergeo',
    extensions: ['.i2g'],
  },
  qbo: {
    mime: 'application/vnd.intu.qbo',
    extensions: ['.qbo'],
  },
  qfx: {
    mime: 'application/vnd.intu.qfx',
    extensions: ['.qfx'],
  },
  rcprofile: {
    mime: 'application/vnd.ipunplugged.rcprofile',
    extensions: ['.rcprofile'],
  },
  irp: {
    mime: 'application/vnd.irepository.package+xml',
    extensions: ['.irp'],
  },
  xpr: {
    mime: 'application/vnd.is-xpr',
    extensions: ['.xpr'],
  },
  fcs: {
    mime: 'application/vnd.isac.fcs',
    extensions: ['.fcs'],
  },
  jam: {
    mime: 'application/vnd.jam',
    extensions: ['.jam'],
  },
  rms: {
    mime: 'application/vnd.jcp.javame.midlet-rms',
    extensions: ['.rms'],
  },
  jisp: {
    mime: 'application/vnd.jisp',
    extensions: ['.jisp'],
  },
  joda: {
    mime: 'application/vnd.joost.joda-archive',
    extensions: ['.joda'],
  },
  ktz: {
    mime: 'application/vnd.kahootz',
    extensions: ['.ktz', '.ktr'],
  },
  ktr: {
    mime: 'application/vnd.kahootz',
    extensions: ['.ktz', '.ktr'],
  },
  karbon: {
    mime: 'application/vnd.kde.karbon',
    extensions: ['.karbon'],
  },
  chrt: {
    mime: 'application/vnd.kde.kchart',
    extensions: ['.chrt'],
  },
  kfo: {
    mime: 'application/vnd.kde.kformula',
    extensions: ['.kfo'],
  },
  flw: {
    mime: 'application/vnd.kde.kivio',
    extensions: ['.flw'],
  },
  kon: {
    mime: 'application/vnd.kde.kontour',
    extensions: ['.kon'],
  },
  kpr: {
    mime: 'application/vnd.kde.kpresenter',
    extensions: ['.kpr', '.kpt'],
  },
  kpt: {
    mime: 'application/vnd.kde.kpresenter',
    extensions: ['.kpr', '.kpt'],
  },
  ksp: {
    mime: 'application/vnd.kde.kspread',
    extensions: ['.ksp'],
  },
  kwd: {
    mime: 'application/vnd.kde.kword',
    extensions: ['.kwd', '.kwt'],
  },
  kwt: {
    mime: 'application/vnd.kde.kword',
    extensions: ['.kwd', '.kwt'],
  },
  htke: {
    mime: 'application/vnd.kenameaapp',
    extensions: ['.htke'],
  },
  kia: {
    mime: 'application/vnd.kidspiration',
    extensions: ['.kia'],
  },
  kne: {
    mime: 'application/vnd.kinar',
    extensions: ['.kne', '.knp'],
  },
  knp: {
    mime: 'application/vnd.kinar',
    extensions: ['.kne', '.knp'],
  },
  skp: {
    mime: 'application/vnd.koan',
    extensions: ['.skp', '.skd', '.skt', '.skm'],
  },
  skd: {
    mime: 'application/vnd.koan',
    extensions: ['.skp', '.skd', '.skt', '.skm'],
  },
  skt: {
    mime: 'application/vnd.koan',
    extensions: ['.skp', '.skd', '.skt', '.skm'],
  },
  skm: {
    mime: 'application/vnd.koan',
    extensions: ['.skp', '.skd', '.skt', '.skm'],
  },
  sse: {
    mime: 'application/vnd.kodak-descriptor',
    extensions: ['.sse'],
  },
  lasxml: {
    mime: 'application/vnd.las.las+xml',
    extensions: ['.lasxml'],
  },
  lbd: {
    mime: 'application/vnd.llamagraphics.life-balance.desktop',
    extensions: ['.lbd'],
  },
  lbe: {
    mime: 'application/vnd.llamagraphics.life-balance.exchange+xml',
    extensions: ['.lbe'],
  },
  apr: {
    mime: 'application/vnd.lotus-approach',
    extensions: ['.apr'],
  },
  pre: {
    mime: 'application/vnd.lotus-freelance',
    extensions: ['.pre'],
  },
  nsf: {
    mime: 'application/vnd.lotus-notes',
    extensions: ['.nsf'],
  },
  org: {
    mime: 'application/vnd.lotus-organizer',
    extensions: ['.org'],
  },
  scm: {
    mime: 'application/vnd.lotus-screencam',
    extensions: ['.scm'],
  },
  lwp: {
    mime: 'application/vnd.lotus-wordpro',
    extensions: ['.lwp'],
  },
  portpkg: {
    mime: 'application/vnd.macports.portpkg',
    extensions: ['.portpkg'],
  },
  mvt: {
    mime: 'application/vnd.mapbox-vector-tile',
    extensions: ['.mvt'],
  },
  mcd: {
    mime: 'application/vnd.mcd',
    extensions: ['.mcd'],
  },
  mc1: {
    mime: 'application/vnd.medcalcdata',
    extensions: ['.mc1'],
  },
  cdkey: {
    mime: 'application/vnd.mediastation.cdkey',
    extensions: ['.cdkey'],
  },
  mwf: {
    mime: 'application/vnd.mfer',
    extensions: ['.mwf'],
  },
  mfm: {
    mime: 'application/vnd.mfmp',
    extensions: ['.mfm'],
  },
  flo: {
    mime: 'application/vnd.micrografx.flo',
    extensions: ['.flo'],
  },
  igx: {
    mime: 'application/vnd.micrografx.igx',
    extensions: ['.igx'],
  },
  mif: {
    mime: 'application/vnd.mif',
    extensions: ['.mif'],
  },
  daf: {
    mime: 'application/vnd.mobius.daf',
    extensions: ['.daf'],
  },
  dis: {
    mime: 'application/vnd.mobius.dis',
    extensions: ['.dis'],
  },
  mbk: {
    mime: 'application/vnd.mobius.mbk',
    extensions: ['.mbk'],
  },
  mqy: {
    mime: 'application/vnd.mobius.mqy',
    extensions: ['.mqy'],
  },
  msl: {
    mime: 'application/vnd.mobius.msl',
    extensions: ['.msl'],
  },
  plc: {
    mime: 'application/vnd.mobius.plc',
    extensions: ['.plc'],
  },
  txf: {
    mime: 'application/vnd.mobius.txf',
    extensions: ['.txf'],
  },
  mpn: {
    mime: 'application/vnd.mophun.application',
    extensions: ['.mpn'],
  },
  mpc: {
    mime: 'application/vnd.mophun.certificate',
    extensions: ['.mpc'],
  },
  xul: {
    mime: 'application/vnd.mozilla.xul+xml',
    extensions: ['.xul'],
  },
  cil: {
    mime: 'application/vnd.ms-artgalry',
    extensions: ['.cil'],
  },
  cab: {
    mime: 'application/vnd.ms-cab-compressed',
    extensions: ['.cab'],
  },
  xls: {
    mime: 'application/vnd.ms-excel',
    extensions: ['.xls', '.xlm', '.xla', '.xlc', '.xlt', '.xlw'],
  },
  xlm: {
    mime: 'application/vnd.ms-excel',
    extensions: ['.xls', '.xlm', '.xla', '.xlc', '.xlt', '.xlw'],
  },
  xla: {
    mime: 'application/vnd.ms-excel',
    extensions: ['.xls', '.xlm', '.xla', '.xlc', '.xlt', '.xlw'],
  },
  xlc: {
    mime: 'application/vnd.ms-excel',
    extensions: ['.xls', '.xlm', '.xla', '.xlc', '.xlt', '.xlw'],
  },
  xlt: {
    mime: 'application/vnd.ms-excel',
    extensions: ['.xls', '.xlm', '.xla', '.xlc', '.xlt', '.xlw'],
  },
  xlw: {
    mime: 'application/vnd.ms-excel',
    extensions: ['.xls', '.xlm', '.xla', '.xlc', '.xlt', '.xlw'],
  },
  xlam: {
    mime: 'application/vnd.ms-excel.addin.macroenabled.12',
    extensions: ['.xlam'],
  },
  xlsb: {
    mime: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
    extensions: ['.xlsb'],
  },
  xlsm: {
    mime: 'application/vnd.ms-excel.sheet.macroenabled.12',
    extensions: ['.xlsm'],
  },
  xltm: {
    mime: 'application/vnd.ms-excel.template.macroenabled.12',
    extensions: ['.xltm'],
  },
  eot: {
    mime: 'application/vnd.ms-fontobject',
    extensions: ['.eot'],
  },
  chm: {
    mime: 'application/vnd.ms-htmlhelp',
    extensions: ['.chm'],
  },
  ims: {
    mime: 'application/vnd.ms-ims',
    extensions: ['.ims'],
  },
  lrm: {
    mime: 'application/vnd.ms-lrm',
    extensions: ['.lrm'],
  },
  thmx: {
    mime: 'application/vnd.ms-officetheme',
    extensions: ['.thmx'],
  },
  msg: {
    mime: 'application/vnd.ms-outlook',
    extensions: ['.msg'],
  },
  cat: {
    mime: 'application/vnd.ms-pki.seccat',
    extensions: ['.cat'],
  },
  stl: {
    mime: 'model/stl',
    extensions: ['.stl'],
  },
  ppt: {
    mime: 'application/vnd.ms-powerpoint',
    extensions: ['.ppt', '.pps', '.pot'],
  },
  pps: {
    mime: 'application/vnd.ms-powerpoint',
    extensions: ['.ppt', '.pps', '.pot'],
  },
  pot: {
    mime: 'application/vnd.ms-powerpoint',
    extensions: ['.ppt', '.pps', '.pot'],
  },
  ppam: {
    mime: 'application/vnd.ms-powerpoint.addin.macroenabled.12',
    extensions: ['.ppam'],
  },
  pptm: {
    mime: 'application/vnd.ms-powerpoint.presentation.macroenabled.12',
    extensions: ['.pptm'],
  },
  sldm: {
    mime: 'application/vnd.ms-powerpoint.slide.macroenabled.12',
    extensions: ['.sldm'],
  },
  ppsm: {
    mime: 'application/vnd.ms-powerpoint.slideshow.macroenabled.12',
    extensions: ['.ppsm'],
  },
  potm: {
    mime: 'application/vnd.ms-powerpoint.template.macroenabled.12',
    extensions: ['.potm'],
  },
  mpt: {
    mime: 'application/vnd.ms-project',
    extensions: ['.mpp', '.mpt'],
  },
  docm: {
    mime: 'application/vnd.ms-word.document.macroenabled.12',
    extensions: ['.docm'],
  },
  dotm: {
    mime: 'application/vnd.ms-word.template.macroenabled.12',
    extensions: ['.dotm'],
  },
  wps: {
    mime: 'application/vnd.ms-works',
    extensions: ['.wps', '.wks', '.wcm', '.wdb'],
  },
  wks: {
    mime: 'application/vnd.ms-works',
    extensions: ['.wps', '.wks', '.wcm', '.wdb'],
  },
  wcm: {
    mime: 'application/vnd.ms-works',
    extensions: ['.wps', '.wks', '.wcm', '.wdb'],
  },
  wdb: {
    mime: 'application/vnd.ms-works',
    extensions: ['.wps', '.wks', '.wcm', '.wdb'],
  },
  wpl: {
    mime: 'application/vnd.ms-wpl',
    extensions: ['.wpl'],
  },
  xps: {
    mime: 'application/vnd.ms-xpsdocument',
    extensions: ['.xps'],
  },
  mseq: {
    mime: 'application/vnd.mseq',
    extensions: ['.mseq'],
  },
  mus: {
    mime: 'application/vnd.musician',
    extensions: ['.mus'],
  },
  msty: {
    mime: 'application/vnd.muvee.style',
    extensions: ['.msty'],
  },
  taglet: {
    mime: 'application/vnd.mynfc',
    extensions: ['.taglet'],
  },
  nlu: {
    mime: 'application/vnd.neurolanguage.nlu',
    extensions: ['.nlu'],
  },
  ntf: {
    mime: 'application/vnd.nitf',
    extensions: ['.ntf', '.nitf'],
  },
  nitf: {
    mime: 'application/vnd.nitf',
    extensions: ['.ntf', '.nitf'],
  },
  nnd: {
    mime: 'application/vnd.noblenet-directory',
    extensions: ['.nnd'],
  },
  nns: {
    mime: 'application/vnd.noblenet-sealer',
    extensions: ['.nns'],
  },
  nnw: {
    mime: 'application/vnd.noblenet-web',
    extensions: ['.nnw'],
  },
  ngdat: {
    mime: 'application/vnd.nokia.n-gage.data',
    extensions: ['.ngdat'],
  },
  'n-gage': {
    mime: 'application/vnd.nokia.n-gage.symbian.install',
    extensions: ['.n-gage'],
  },
  rpst: {
    mime: 'application/vnd.nokia.radio-preset',
    extensions: ['.rpst'],
  },
  rpss: {
    mime: 'application/vnd.nokia.radio-presets',
    extensions: ['.rpss'],
  },
  edm: {
    mime: 'application/vnd.novadigm.edm',
    extensions: ['.edm'],
  },
  edx: {
    mime: 'application/vnd.novadigm.edx',
    extensions: ['.edx'],
  },
  ext: {
    mime: 'application/vnd.novadigm.ext',
    extensions: ['.ext'],
  },
  odc: {
    mime: 'application/vnd.oasis.opendocument.chart',
    extensions: ['.odc'],
  },
  otc: {
    mime: 'application/vnd.oasis.opendocument.chart-template',
    extensions: ['.otc'],
  },
  odb: {
    mime: 'application/vnd.oasis.opendocument.database',
    extensions: ['.odb'],
  },
  odf: {
    mime: 'application/vnd.oasis.opendocument.formula',
    extensions: ['.odf'],
  },
  odft: {
    mime: 'application/vnd.oasis.opendocument.formula-template',
    extensions: ['.odft'],
  },
  odg: {
    mime: 'application/vnd.oasis.opendocument.graphics',
    extensions: ['.odg'],
  },
  otg: {
    mime: 'application/vnd.oasis.opendocument.graphics-template',
    extensions: ['.otg'],
  },
  odi: {
    mime: 'application/vnd.oasis.opendocument.image',
    extensions: ['.odi'],
  },
  oti: {
    mime: 'application/vnd.oasis.opendocument.image-template',
    extensions: ['.oti'],
  },
  odp: {
    mime: 'application/vnd.oasis.opendocument.presentation',
    extensions: ['.odp'],
  },
  otp: {
    mime: 'application/vnd.oasis.opendocument.presentation-template',
    extensions: ['.otp'],
  },
  ods: {
    mime: 'application/vnd.oasis.opendocument.spreadsheet',
    extensions: ['.ods'],
  },
  ots: {
    mime: 'application/vnd.oasis.opendocument.spreadsheet-template',
    extensions: ['.ots'],
  },
  odt: {
    mime: 'application/vnd.oasis.opendocument.text',
    extensions: ['.odt'],
  },
  odm: {
    mime: 'application/vnd.oasis.opendocument.text-master',
    extensions: ['.odm'],
  },
  ott: {
    mime: 'application/vnd.oasis.opendocument.text-template',
    extensions: ['.ott'],
  },
  oth: {
    mime: 'application/vnd.oasis.opendocument.text-web',
    extensions: ['.oth'],
  },
  xo: {
    mime: 'application/vnd.olpc-sugar',
    extensions: ['.xo'],
  },
  dd2: {
    mime: 'application/vnd.oma.dd2+xml',
    extensions: ['.dd2'],
  },
  obgx: {
    mime: 'application/vnd.openblox.game+xml',
    extensions: ['.obgx'],
  },
  oxt: {
    mime: 'application/vnd.openofficeorg.extension',
    extensions: ['.oxt'],
  },
  osm: {
    mime: 'application/vnd.openstreetmap.data+xml',
    extensions: ['.osm'],
  },
  pptx: {
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extensions: ['.pptx'],
  },
  sldx: {
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.slide',
    extensions: ['.sldx'],
  },
  ppsx: {
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    extensions: ['.ppsx'],
  },
  potx: {
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.template',
    extensions: ['.potx'],
  },
  xlsx: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: ['.xlsx'],
  },
  xltx: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    extensions: ['.xltx'],
  },
  docx: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extensions: ['.docx'],
  },
  dotx: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    extensions: ['.dotx'],
  },
  mgp: {
    mime: 'application/vnd.osgeo.mapguide.package',
    extensions: ['.mgp'],
  },
  dp: {
    mime: 'application/vnd.osgi.dp',
    extensions: ['.dp'],
  },
  esa: {
    mime: 'application/vnd.osgi.subsystem',
    extensions: ['.esa'],
  },
  pdb: {
    mime: 'application/vnd.palm',
    extensions: ['.pdb', '.pqa', '.oprc'],
  },
  pqa: {
    mime: 'application/vnd.palm',
    extensions: ['.pdb', '.pqa', '.oprc'],
  },
  oprc: {
    mime: 'application/vnd.palm',
    extensions: ['.pdb', '.pqa', '.oprc'],
  },
  paw: {
    mime: 'application/vnd.pawaafile',
    extensions: ['.paw'],
  },
  str: {
    mime: 'application/vnd.pg.format',
    extensions: ['.str'],
  },
  ei6: {
    mime: 'application/vnd.pg.osasli',
    extensions: ['.ei6'],
  },
  efif: {
    mime: 'application/vnd.picsel',
    extensions: ['.efif'],
  },
  wg: {
    mime: 'application/vnd.pmi.widget',
    extensions: ['.wg'],
  },
  plf: {
    mime: 'application/vnd.pocketlearn',
    extensions: ['.plf'],
  },
  pbd: {
    mime: 'application/vnd.powerbuilder6',
    extensions: ['.pbd'],
  },
  box: {
    mime: 'application/vnd.previewsystems.box',
    extensions: ['.box'],
  },
  mgz: {
    mime: 'application/vnd.proteus.magazine',
    extensions: ['.mgz'],
  },
  qps: {
    mime: 'application/vnd.publishare-delta-tree',
    extensions: ['.qps'],
  },
  ptid: {
    mime: 'application/vnd.pvi.ptid1',
    extensions: ['.ptid'],
  },
  qxd: {
    mime: 'application/vnd.quark.quarkxpress',
    extensions: ['.qxd', '.qxt', '.qwd', '.qwt', '.qxl', '.qxb'],
  },
  qxt: {
    mime: 'application/vnd.quark.quarkxpress',
    extensions: ['.qxd', '.qxt', '.qwd', '.qwt', '.qxl', '.qxb'],
  },
  qwd: {
    mime: 'application/vnd.quark.quarkxpress',
    extensions: ['.qxd', '.qxt', '.qwd', '.qwt', '.qxl', '.qxb'],
  },
  qwt: {
    mime: 'application/vnd.quark.quarkxpress',
    extensions: ['.qxd', '.qxt', '.qwd', '.qwt', '.qxl', '.qxb'],
  },
  qxl: {
    mime: 'application/vnd.quark.quarkxpress',
    extensions: ['.qxd', '.qxt', '.qwd', '.qwt', '.qxl', '.qxb'],
  },
  qxb: {
    mime: 'application/vnd.quark.quarkxpress',
    extensions: ['.qxd', '.qxt', '.qwd', '.qwt', '.qxl', '.qxb'],
  },
  rar: {
    mime: 'application/vnd.rar',
    extensions: ['.rar'],
  },
  bed: {
    mime: 'application/vnd.realvnc.bed',
    extensions: ['.bed'],
  },
  mxl: {
    mime: 'application/vnd.recordare.musicxml',
    extensions: ['.mxl'],
  },
  musicxml: {
    mime: 'application/vnd.recordare.musicxml+xml',
    extensions: ['.musicxml'],
  },
  cryptonote: {
    mime: 'application/vnd.rig.cryptonote',
    extensions: ['.cryptonote'],
  },
  cod: {
    mime: 'application/vnd.rim.cod',
    extensions: ['.cod'],
  },
  rm: {
    mime: 'application/vnd.rn-realmedia',
    extensions: ['.rm'],
  },
  rmvb: {
    mime: 'application/vnd.rn-realmedia-vbr',
    extensions: ['.rmvb'],
  },
  link66: {
    mime: 'application/vnd.route66.link66+xml',
    extensions: ['.link66'],
  },
  st: {
    mime: 'application/vnd.sailingtracker.track',
    extensions: ['.st'],
  },
  see: {
    mime: 'application/vnd.seemail',
    extensions: ['.see'],
  },
  sema: {
    mime: 'application/vnd.sema',
    extensions: ['.sema'],
  },
  semd: {
    mime: 'application/vnd.semd',
    extensions: ['.semd'],
  },
  semf: {
    mime: 'application/vnd.semf',
    extensions: ['.semf'],
  },
  ifm: {
    mime: 'application/vnd.shana.informed.formdata',
    extensions: ['.ifm'],
  },
  itp: {
    mime: 'application/vnd.shana.informed.formtemplate',
    extensions: ['.itp'],
  },
  iif: {
    mime: 'application/vnd.shana.informed.interchange',
    extensions: ['.iif'],
  },
  ipk: {
    mime: 'application/vnd.shana.informed.package',
    extensions: ['.ipk'],
  },
  twd: {
    mime: 'application/vnd.simtech-mindmapper',
    extensions: ['.twd', '.twds'],
  },
  twds: {
    mime: 'application/vnd.simtech-mindmapper',
    extensions: ['.twd', '.twds'],
  },
  mmf: {
    mime: 'application/vnd.smaf',
    extensions: ['.mmf'],
  },
  teacher: {
    mime: 'application/vnd.smart.teacher',
    extensions: ['.teacher'],
  },
  fo: {
    mime: 'application/vnd.software602.filler.form+xml',
    extensions: ['.fo'],
  },
  sdkm: {
    mime: 'application/vnd.solent.sdkm+xml',
    extensions: ['.sdkm', '.sdkd'],
  },
  sdkd: {
    mime: 'application/vnd.solent.sdkm+xml',
    extensions: ['.sdkm', '.sdkd'],
  },
  dxp: {
    mime: 'application/vnd.spotfire.dxp',
    extensions: ['.dxp'],
  },
  sfs: {
    mime: 'application/vnd.spotfire.sfs',
    extensions: ['.sfs'],
  },
  sdc: {
    mime: 'application/vnd.stardivision.calc',
    extensions: ['.sdc'],
  },
  sda: {
    mime: 'application/vnd.stardivision.draw',
    extensions: ['.sda'],
  },
  sdd: {
    mime: 'application/vnd.stardivision.impress',
    extensions: ['.sdd'],
  },
  smf: {
    mime: 'application/vnd.stardivision.math',
    extensions: ['.smf'],
  },
  sdw: {
    mime: 'application/vnd.stardivision.writer',
    extensions: ['.sdw', '.vor'],
  },
  vor: {
    mime: 'application/vnd.stardivision.writer',
    extensions: ['.sdw', '.vor'],
  },
  sgl: {
    mime: 'application/vnd.stardivision.writer-global',
    extensions: ['.sgl'],
  },
  smzip: {
    mime: 'application/vnd.stepmania.package',
    extensions: ['.smzip'],
  },
  sm: {
    mime: 'application/vnd.stepmania.stepchart',
    extensions: ['.sm'],
  },
  wadl: {
    mime: 'application/vnd.sun.wadl+xml',
    extensions: ['.wadl'],
  },
  sxc: {
    mime: 'application/vnd.sun.xml.calc',
    extensions: ['.sxc'],
  },
  stc: {
    mime: 'application/vnd.sun.xml.calc.template',
    extensions: ['.stc'],
  },
  sxd: {
    mime: 'application/vnd.sun.xml.draw',
    extensions: ['.sxd'],
  },
  std: {
    mime: 'application/vnd.sun.xml.draw.template',
    extensions: ['.std'],
  },
  sxi: {
    mime: 'application/vnd.sun.xml.impress',
    extensions: ['.sxi'],
  },
  sti: {
    mime: 'application/vnd.sun.xml.impress.template',
    extensions: ['.sti'],
  },
  sxm: {
    mime: 'application/vnd.sun.xml.math',
    extensions: ['.sxm'],
  },
  sxw: {
    mime: 'application/vnd.sun.xml.writer',
    extensions: ['.sxw'],
  },
  sxg: {
    mime: 'application/vnd.sun.xml.writer.global',
    extensions: ['.sxg'],
  },
  stw: {
    mime: 'application/vnd.sun.xml.writer.template',
    extensions: ['.stw'],
  },
  sus: {
    mime: 'application/vnd.sus-calendar',
    extensions: ['.sus', '.susp'],
  },
  susp: {
    mime: 'application/vnd.sus-calendar',
    extensions: ['.sus', '.susp'],
  },
  svd: {
    mime: 'application/vnd.svd',
    extensions: ['.svd'],
  },
  sis: {
    mime: 'application/vnd.symbian.install',
    extensions: ['.sis', '.sisx'],
  },
  sisx: {
    mime: 'application/vnd.symbian.install',
    extensions: ['.sis', '.sisx'],
  },
  xsm: {
    mime: 'application/vnd.syncml+xml',
    extensions: ['.xsm'],
  },
  bdm: {
    mime: 'application/vnd.syncml.dm+wbxml',
    extensions: ['.bdm'],
  },
  xdm: {
    mime: 'application/vnd.syncml.dm+xml',
    extensions: ['.xdm'],
  },
  ddf: {
    mime: 'application/vnd.syncml.dmddf+xml',
    extensions: ['.ddf'],
  },
  tao: {
    mime: 'application/vnd.tao.intent-module-archive',
    extensions: ['.tao'],
  },
  pcap: {
    mime: 'application/vnd.tcpdump.pcap',
    extensions: ['.pcap', '.cap', '.dmp'],
  },
  cap: {
    mime: 'application/vnd.tcpdump.pcap',
    extensions: ['.pcap', '.cap', '.dmp'],
  },
  dmp: {
    mime: 'application/vnd.tcpdump.pcap',
    extensions: ['.pcap', '.cap', '.dmp'],
  },
  tmo: {
    mime: 'application/vnd.tmobile-livetv',
    extensions: ['.tmo'],
  },
  tpt: {
    mime: 'application/vnd.trid.tpt',
    extensions: ['.tpt'],
  },
  mxs: {
    mime: 'application/vnd.triscape.mxs',
    extensions: ['.mxs'],
  },
  tra: {
    mime: 'application/vnd.trueapp',
    extensions: ['.tra'],
  },
  ufd: {
    mime: 'application/vnd.ufdl',
    extensions: ['.ufd', '.ufdl'],
  },
  ufdl: {
    mime: 'application/vnd.ufdl',
    extensions: ['.ufd', '.ufdl'],
  },
  utz: {
    mime: 'application/vnd.uiq.theme',
    extensions: ['.utz'],
  },
  umj: {
    mime: 'application/vnd.umajin',
    extensions: ['.umj'],
  },
  unityweb: {
    mime: 'application/vnd.unity',
    extensions: ['.unityweb'],
  },
  uoml: {
    mime: 'application/vnd.uoml+xml',
    extensions: ['.uoml'],
  },
  vcx: {
    mime: 'application/vnd.vcx',
    extensions: ['.vcx'],
  },
  vsd: {
    mime: 'application/vnd.visio',
    extensions: ['.vsd', '.vst', '.vss', '.vsw'],
  },
  vst: {
    mime: 'application/vnd.visio',
    extensions: ['.vsd', '.vst', '.vss', '.vsw'],
  },
  vss: {
    mime: 'application/vnd.visio',
    extensions: ['.vsd', '.vst', '.vss', '.vsw'],
  },
  vsw: {
    mime: 'application/vnd.visio',
    extensions: ['.vsd', '.vst', '.vss', '.vsw'],
  },
  vis: {
    mime: 'application/vnd.visionary',
    extensions: ['.vis'],
  },
  vsf: {
    mime: 'application/vnd.vsf',
    extensions: ['.vsf'],
  },
  wbxml: {
    mime: 'application/vnd.wap.wbxml',
    extensions: ['.wbxml'],
  },
  wmlc: {
    mime: 'application/vnd.wap.wmlc',
    extensions: ['.wmlc'],
  },
  wmlsc: {
    mime: 'application/vnd.wap.wmlscriptc',
    extensions: ['.wmlsc'],
  },
  wtb: {
    mime: 'application/vnd.webturbo',
    extensions: ['.wtb'],
  },
  nbp: {
    mime: 'application/vnd.wolfram.player',
    extensions: ['.nbp'],
  },
  wpd: {
    mime: 'application/vnd.wordperfect',
    extensions: ['.wpd'],
  },
  wqd: {
    mime: 'application/vnd.wqd',
    extensions: ['.wqd'],
  },
  stf: {
    mime: 'application/vnd.wt.stf',
    extensions: ['.stf'],
  },
  xar: {
    mime: 'application/vnd.xara',
    extensions: ['.xar'],
  },
  xfdl: {
    mime: 'application/vnd.xfdl',
    extensions: ['.xfdl'],
  },
  hvd: {
    mime: 'application/vnd.yamaha.hv-dic',
    extensions: ['.hvd'],
  },
  hvs: {
    mime: 'application/vnd.yamaha.hv-script',
    extensions: ['.hvs'],
  },
  hvp: {
    mime: 'application/vnd.yamaha.hv-voice',
    extensions: ['.hvp'],
  },
  osf: {
    mime: 'application/vnd.yamaha.openscoreformat',
    extensions: ['.osf'],
  },
  osfpvg: {
    mime: 'application/vnd.yamaha.openscoreformat.osfpvg+xml',
    extensions: ['.osfpvg'],
  },
  saf: {
    mime: 'application/vnd.yamaha.smaf-audio',
    extensions: ['.saf'],
  },
  spf: {
    mime: 'application/vnd.yamaha.smaf-phrase',
    extensions: ['.spf'],
  },
  cmp: {
    mime: 'application/vnd.yellowriver-custom-menu',
    extensions: ['.cmp'],
  },
  zir: {
    mime: 'application/vnd.zul',
    extensions: ['.zir', '.zirz'],
  },
  zirz: {
    mime: 'application/vnd.zul',
    extensions: ['.zir', '.zirz'],
  },
  zaz: {
    mime: 'application/vnd.zzazz.deck+xml',
    extensions: ['.zaz'],
  },
  vxml: {
    mime: 'application/voicexml+xml',
    extensions: ['.vxml'],
  },
  wasm: {
    mime: 'application/wasm',
    extensions: ['.wasm'],
  },
  wif: {
    mime: 'application/watcherinfo+xml',
    extensions: ['.wif'],
  },
  wgt: {
    mime: 'application/widget',
    extensions: ['.wgt'],
  },
  hlp: {
    mime: 'application/winhlp',
    extensions: ['.hlp'],
  },
  wsdl: {
    mime: 'application/wsdl+xml',
    extensions: ['.wsdl'],
  },
  wspolicy: {
    mime: 'application/wspolicy+xml',
    extensions: ['.wspolicy'],
  },
  '7z': {
    mime: 'application/x-7z-compressed',
    extensions: ['.7z'],
  },
  abw: {
    mime: 'application/x-abiword',
    extensions: ['.abw'],
  },
  ace: {
    mime: 'application/x-ace-compressed',
    extensions: ['.ace'],
  },
  arj: {
    mime: 'application/x-arj',
    extensions: ['.arj'],
  },
  aab: {
    mime: 'application/x-authorware-bin',
    extensions: ['.aab', '.x32', '.u32', '.vox'],
  },
  x32: {
    mime: 'application/x-authorware-bin',
    extensions: ['.aab', '.x32', '.u32', '.vox'],
  },
  u32: {
    mime: 'application/x-authorware-bin',
    extensions: ['.aab', '.x32', '.u32', '.vox'],
  },
  vox: {
    mime: 'application/x-authorware-bin',
    extensions: ['.aab', '.x32', '.u32', '.vox'],
  },
  aam: {
    mime: 'application/x-authorware-map',
    extensions: ['.aam'],
  },
  aas: {
    mime: 'application/x-authorware-seg',
    extensions: ['.aas'],
  },
  bcpio: {
    mime: 'application/x-bcpio',
    extensions: ['.bcpio'],
  },
  torrent: {
    mime: 'application/x-bittorrent',
    extensions: ['.torrent'],
  },
  blb: {
    mime: 'application/x-blorb',
    extensions: ['.blb', '.blorb'],
  },
  blorb: {
    mime: 'application/x-blorb',
    extensions: ['.blb', '.blorb'],
  },
  bz: {
    mime: 'application/x-bzip',
    extensions: ['.bz'],
  },
  bz2: {
    mime: 'application/x-bzip2',
    extensions: ['.bz2', '.boz'],
  },
  boz: {
    mime: 'application/x-bzip2',
    extensions: ['.bz2', '.boz'],
  },
  cbr: {
    mime: 'application/x-cbr',
    extensions: ['.cbr', '.cba', '.cbt', '.cbz', '.cb7'],
  },
  cba: {
    mime: 'application/x-cbr',
    extensions: ['.cbr', '.cba', '.cbt', '.cbz', '.cb7'],
  },
  cbt: {
    mime: 'application/x-cbr',
    extensions: ['.cbr', '.cba', '.cbt', '.cbz', '.cb7'],
  },
  cbz: {
    mime: 'application/x-cbr',
    extensions: ['.cbr', '.cba', '.cbt', '.cbz', '.cb7'],
  },
  cb7: {
    mime: 'application/x-cbr',
    extensions: ['.cbr', '.cba', '.cbt', '.cbz', '.cb7'],
  },
  vcd: {
    mime: 'application/x-cdlink',
    extensions: ['.vcd'],
  },
  cfs: {
    mime: 'application/x-cfs-compressed',
    extensions: ['.cfs'],
  },
  chat: {
    mime: 'application/x-chat',
    extensions: ['.chat'],
  },
  pgn: {
    mime: 'application/x-chess-pgn',
    extensions: ['.pgn'],
  },
  crx: {
    mime: 'application/x-chrome-extension',
    extensions: ['.crx'],
  },
  cco: {
    mime: 'application/x-cocoa',
    extensions: ['.cco'],
  },
  nsc: {
    mime: 'application/x-conference',
    extensions: ['.nsc'],
  },
  cpio: {
    mime: 'application/x-cpio',
    extensions: ['.cpio'],
  },
  csh: {
    mime: 'application/x-csh',
    extensions: ['.csh'],
  },
  udeb: {
    mime: 'application/x-debian-package',
    extensions: ['.deb', '.udeb'],
  },
  dgc: {
    mime: 'application/x-dgc-compressed',
    extensions: ['.dgc'],
  },
  dir: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  dcr: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  dxr: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  cst: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  cct: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  cxt: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  w3d: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  fgd: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  swa: {
    mime: 'application/x-director',
    extensions: [
      '.dir',
      '.dcr',
      '.dxr',
      '.cst',
      '.cct',
      '.cxt',
      '.w3d',
      '.fgd',
      '.swa',
    ],
  },
  wad: {
    mime: 'application/x-doom',
    extensions: ['.wad'],
  },
  ncx: {
    mime: 'application/x-dtbncx+xml',
    extensions: ['.ncx'],
  },
  dtb: {
    mime: 'application/x-dtbook+xml',
    extensions: ['.dtb'],
  },
  res: {
    mime: 'application/x-dtbresource+xml',
    extensions: ['.res'],
  },
  dvi: {
    mime: 'application/x-dvi',
    extensions: ['.dvi'],
  },
  evy: {
    mime: 'application/x-envoy',
    extensions: ['.evy'],
  },
  eva: {
    mime: 'application/x-eva',
    extensions: ['.eva'],
  },
  bdf: {
    mime: 'application/x-font-bdf',
    extensions: ['.bdf'],
  },
  gsf: {
    mime: 'application/x-font-ghostscript',
    extensions: ['.gsf'],
  },
  psf: {
    mime: 'application/x-font-linux-psf',
    extensions: ['.psf'],
  },
  pcf: {
    mime: 'application/x-font-pcf',
    extensions: ['.pcf'],
  },
  snf: {
    mime: 'application/x-font-snf',
    extensions: ['.snf'],
  },
  pfa: {
    mime: 'application/x-font-type1',
    extensions: ['.pfa', '.pfb', '.pfm', '.afm'],
  },
  pfb: {
    mime: 'application/x-font-type1',
    extensions: ['.pfa', '.pfb', '.pfm', '.afm'],
  },
  pfm: {
    mime: 'application/x-font-type1',
    extensions: ['.pfa', '.pfb', '.pfm', '.afm'],
  },
  afm: {
    mime: 'application/x-font-type1',
    extensions: ['.pfa', '.pfb', '.pfm', '.afm'],
  },
  arc: {
    mime: 'application/x-freearc',
    extensions: ['.arc'],
  },
  spl: {
    mime: 'application/x-futuresplash',
    extensions: ['.spl'],
  },
  gca: {
    mime: 'application/x-gca-compressed',
    extensions: ['.gca'],
  },
  ulx: {
    mime: 'application/x-glulx',
    extensions: ['.ulx'],
  },
  gnumeric: {
    mime: 'application/x-gnumeric',
    extensions: ['.gnumeric'],
  },
  gramps: {
    mime: 'application/x-gramps-xml',
    extensions: ['.gramps'],
  },
  gtar: {
    mime: 'application/x-gtar',
    extensions: ['.gtar'],
  },
  hdf: {
    mime: 'application/x-hdf',
    extensions: ['.hdf'],
  },
  php: {
    mime: 'application/x-httpd-php',
    extensions: ['.php'],
  },
  install: {
    mime: 'application/x-install-instructions',
    extensions: ['.install'],
  },
  jardiff: {
    mime: 'application/x-java-archive-diff',
    extensions: ['.jardiff'],
  },
  jnlp: {
    mime: 'application/x-java-jnlp-file',
    extensions: ['.jnlp'],
  },
  kdbx: {
    mime: 'application/x-keepass2',
    extensions: ['.kdbx'],
  },
  latex: {
    mime: 'application/x-latex',
    extensions: ['.latex'],
  },
  luac: {
    mime: 'application/x-lua-bytecode',
    extensions: ['.luac'],
  },
  lzh: {
    mime: 'application/x-lzh-compressed',
    extensions: ['.lzh', '.lha'],
  },
  lha: {
    mime: 'application/x-lzh-compressed',
    extensions: ['.lzh', '.lha'],
  },
  run: {
    mime: 'application/x-makeself',
    extensions: ['.run'],
  },
  mie: {
    mime: 'application/x-mie',
    extensions: ['.mie'],
  },
  prc: {
    mime: 'application/x-mobipocket-ebook',
    extensions: ['.prc', '.mobi'],
  },
  mobi: {
    mime: 'application/x-mobipocket-ebook',
    extensions: ['.prc', '.mobi'],
  },
  application: {
    mime: 'application/x-ms-application',
    extensions: ['.application'],
  },
  lnk: {
    mime: 'application/x-ms-shortcut',
    extensions: ['.lnk'],
  },
  wmd: {
    mime: 'application/x-ms-wmd',
    extensions: ['.wmd'],
  },
  wmz: {
    mime: 'application/x-ms-wmz',
    extensions: ['.wmz'],
  },
  xbap: {
    mime: 'application/x-ms-xbap',
    extensions: ['.xbap'],
  },
  mdb: {
    mime: 'application/x-msaccess',
    extensions: ['.mdb'],
  },
  obd: {
    mime: 'application/x-msbinder',
    extensions: ['.obd'],
  },
  crd: {
    mime: 'application/x-mscardfile',
    extensions: ['.crd'],
  },
  clp: {
    mime: 'application/x-msclip',
    extensions: ['.clp'],
  },
  com: {
    mime: 'application/x-msdownload',
    extensions: ['.exe', '.dll', '.com', '.bat', '.msi'],
  },
  bat: {
    mime: 'application/x-msdownload',
    extensions: ['.exe', '.dll', '.com', '.bat', '.msi'],
  },
  mvb: {
    mime: 'application/x-msmediaview',
    extensions: ['.mvb', '.m13', '.m14'],
  },
  m13: {
    mime: 'application/x-msmediaview',
    extensions: ['.mvb', '.m13', '.m14'],
  },
  m14: {
    mime: 'application/x-msmediaview',
    extensions: ['.mvb', '.m13', '.m14'],
  },
  wmf: {
    mime: 'image/wmf',
    extensions: ['.wmf'],
  },
  emf: {
    mime: 'image/emf',
    extensions: ['.emf'],
  },
  emz: {
    mime: 'application/x-msmetafile',
    extensions: ['.wmf', '.wmz', '.emf', '.emz'],
  },
  mny: {
    mime: 'application/x-msmoney',
    extensions: ['.mny'],
  },
  pub: {
    mime: 'application/x-mspublisher',
    extensions: ['.pub'],
  },
  scd: {
    mime: 'application/x-msschedule',
    extensions: ['.scd'],
  },
  trm: {
    mime: 'application/x-msterminal',
    extensions: ['.trm'],
  },
  wri: {
    mime: 'application/x-mswrite',
    extensions: ['.wri'],
  },
  nc: {
    mime: 'application/x-netcdf',
    extensions: ['.nc', '.cdf'],
  },
  cdf: {
    mime: 'application/x-netcdf',
    extensions: ['.nc', '.cdf'],
  },
  pac: {
    mime: 'application/x-ns-proxy-autoconfig',
    extensions: ['.pac'],
  },
  nzb: {
    mime: 'application/x-nzb',
    extensions: ['.nzb'],
  },
  pl: {
    mime: 'application/x-perl',
    extensions: ['.pl', '.pm'],
  },
  pm: {
    mime: 'application/x-perl',
    extensions: ['.pl', '.pm'],
  },
  p12: {
    mime: 'application/x-pkcs12',
    extensions: ['.p12', '.pfx'],
  },
  pfx: {
    mime: 'application/x-pkcs12',
    extensions: ['.p12', '.pfx'],
  },
  p7b: {
    mime: 'application/x-pkcs7-certificates',
    extensions: ['.p7b', '.spc'],
  },
  spc: {
    mime: 'application/x-pkcs7-certificates',
    extensions: ['.p7b', '.spc'],
  },
  p7r: {
    mime: 'application/x-pkcs7-certreqresp',
    extensions: ['.p7r'],
  },
  rpm: {
    mime: 'application/x-redhat-package-manager',
    extensions: ['.rpm'],
  },
  ris: {
    mime: 'application/x-research-info-systems',
    extensions: ['.ris'],
  },
  sea: {
    mime: 'application/x-sea',
    extensions: ['.sea'],
  },
  sh: {
    mime: 'application/x-sh',
    extensions: ['.sh'],
  },
  shar: {
    mime: 'application/x-shar',
    extensions: ['.shar'],
  },
  swf: {
    mime: 'application/x-shockwave-flash',
    extensions: ['.swf'],
  },
  xap: {
    mime: 'application/x-silverlight-app',
    extensions: ['.xap'],
  },
  sql: {
    mime: 'application/x-sql',
    extensions: ['.sql'],
  },
  sit: {
    mime: 'application/x-stuffit',
    extensions: ['.sit'],
  },
  sitx: {
    mime: 'application/x-stuffitx',
    extensions: ['.sitx'],
  },
  srt: {
    mime: 'application/x-subrip',
    extensions: ['.srt'],
  },
  sv4cpio: {
    mime: 'application/x-sv4cpio',
    extensions: ['.sv4cpio'],
  },
  sv4crc: {
    mime: 'application/x-sv4crc',
    extensions: ['.sv4crc'],
  },
  t3: {
    mime: 'application/x-t3vm-image',
    extensions: ['.t3'],
  },
  gam: {
    mime: 'application/x-tads',
    extensions: ['.gam'],
  },
  tar: {
    mime: 'application/x-tar',
    extensions: ['.tar'],
  },
  tcl: {
    mime: 'application/x-tcl',
    extensions: ['.tcl', '.tk'],
  },
  tk: {
    mime: 'application/x-tcl',
    extensions: ['.tcl', '.tk'],
  },
  tex: {
    mime: 'application/x-tex',
    extensions: ['.tex'],
  },
  tfm: {
    mime: 'application/x-tex-tfm',
    extensions: ['.tfm'],
  },
  texinfo: {
    mime: 'application/x-texinfo',
    extensions: ['.texinfo', '.texi'],
  },
  texi: {
    mime: 'application/x-texinfo',
    extensions: ['.texinfo', '.texi'],
  },
  obj: {
    mime: 'model/obj',
    extensions: ['.obj'],
  },
  ustar: {
    mime: 'application/x-ustar',
    extensions: ['.ustar'],
  },
  hdd: {
    mime: 'application/x-virtualbox-hdd',
    extensions: ['.hdd'],
  },
  ova: {
    mime: 'application/x-virtualbox-ova',
    extensions: ['.ova'],
  },
  ovf: {
    mime: 'application/x-virtualbox-ovf',
    extensions: ['.ovf'],
  },
  vbox: {
    mime: 'application/x-virtualbox-vbox',
    extensions: ['.vbox'],
  },
  'vbox-extpack': {
    mime: 'application/x-virtualbox-vbox-extpack',
    extensions: ['.vbox-extpack'],
  },
  vdi: {
    mime: 'application/x-virtualbox-vdi',
    extensions: ['.vdi'],
  },
  vhd: {
    mime: 'application/x-virtualbox-vhd',
    extensions: ['.vhd'],
  },
  vmdk: {
    mime: 'application/x-virtualbox-vmdk',
    extensions: ['.vmdk'],
  },
  src: {
    mime: 'application/x-wais-source',
    extensions: ['.src'],
  },
  webapp: {
    mime: 'application/x-web-app-manifest+json',
    extensions: ['.webapp'],
  },
  der: {
    mime: 'application/x-x509-ca-cert',
    extensions: ['.der', '.crt', '.pem'],
  },
  crt: {
    mime: 'application/x-x509-ca-cert',
    extensions: ['.der', '.crt', '.pem'],
  },
  pem: {
    mime: 'application/x-x509-ca-cert',
    extensions: ['.der', '.crt', '.pem'],
  },
  fig: {
    mime: 'application/x-xfig',
    extensions: ['.fig'],
  },
  xlf: {
    mime: 'application/xliff+xml',
    extensions: ['.xlf'],
  },
  xpi: {
    mime: 'application/x-xpinstall',
    extensions: ['.xpi'],
  },
  xz: {
    mime: 'application/x-xz',
    extensions: ['.xz'],
  },
  z1: {
    mime: 'application/x-zmachine',
    extensions: [
      '.z1',
      '.z2',
      '.z3',
      '.z4',
      '.z5',
      '.z6',
      '.z7',
      '.z8',
    ],
  },
  z2: {
    mime: 'application/x-zmachine',
    extensions: [
      '.z1',
      '.z2',
      '.z3',
      '.z4',
      '.z5',
      '.z6',
      '.z7',
      '.z8',
    ],
  },
  z3: {
    mime: 'application/x-zmachine',
    extensions: [
      '.z1',
      '.z2',
      '.z3',
      '.z4',
      '.z5',
      '.z6',
      '.z7',
      '.z8',
    ],
  },
  z4: {
    mime: 'application/x-zmachine',
    extensions: [
      '.z1',
      '.z2',
      '.z3',
      '.z4',
      '.z5',
      '.z6',
      '.z7',
      '.z8',
    ],
  },
  z5: {
    mime: 'application/x-zmachine',
    extensions: [
      '.z1',
      '.z2',
      '.z3',
      '.z4',
      '.z5',
      '.z6',
      '.z7',
      '.z8',
    ],
  },
  z6: {
    mime: 'application/x-zmachine',
    extensions: [
      '.z1',
      '.z2',
      '.z3',
      '.z4',
      '.z5',
      '.z6',
      '.z7',
      '.z8',
    ],
  },
  z7: {
    mime: 'application/x-zmachine',
    extensions: [
      '.z1',
      '.z2',
      '.z3',
      '.z4',
      '.z5',
      '.z6',
      '.z7',
      '.z8',
    ],
  },
  z8: {
    mime: 'application/x-zmachine',
    extensions: [
      '.z1',
      '.z2',
      '.z3',
      '.z4',
      '.z5',
      '.z6',
      '.z7',
      '.z8',
    ],
  },
  xaml: {
    mime: 'application/xaml+xml',
    extensions: ['.xaml'],
  },
  xav: {
    mime: 'application/xcap-att+xml',
    extensions: ['.xav'],
  },
  xca: {
    mime: 'application/xcap-caps+xml',
    extensions: ['.xca'],
  },
  xdf: {
    mime: 'application/xcap-diff+xml',
    extensions: ['.xdf'],
  },
  xel: {
    mime: 'application/xcap-el+xml',
    extensions: ['.xel'],
  },
  xns: {
    mime: 'application/xcap-ns+xml',
    extensions: ['.xns'],
  },
  xenc: {
    mime: 'application/xenc+xml',
    extensions: ['.xenc'],
  },
  xhtml: {
    mime: 'application/xhtml+xml',
    extensions: ['.xhtml', '.xht'],
  },
  xht: {
    mime: 'application/xhtml+xml',
    extensions: ['.xhtml', '.xht'],
  },
  xml: {
    mime: 'application/xml',
    extensions: ['.xml', '.xsl', '.xsd', '.rng'],
  },
  xsl: {
    mime: 'application/xml',
    extensions: ['.xml', '.xsl', '.xsd', '.rng'],
  },
  xsd: {
    mime: 'application/xml',
    extensions: ['.xml', '.xsl', '.xsd', '.rng'],
  },
  rng: {
    mime: 'application/xml',
    extensions: ['.xml', '.xsl', '.xsd', '.rng'],
  },
  dtd: {
    mime: 'application/xml-dtd',
    extensions: ['.dtd'],
  },
  xop: {
    mime: 'application/xop+xml',
    extensions: ['.xop'],
  },
  xpl: {
    mime: 'application/xproc+xml',
    extensions: ['.xpl'],
  },
  xslt: {
    mime: 'application/xslt+xml',
    extensions: ['.xsl', '.xslt'],
  },
  xspf: {
    mime: 'application/xspf+xml',
    extensions: ['.xspf'],
  },
  mxml: {
    mime: 'application/xv+xml',
    extensions: ['.mxml', '.xhvml', '.xvml', '.xvm'],
  },
  xhvml: {
    mime: 'application/xv+xml',
    extensions: ['.mxml', '.xhvml', '.xvml', '.xvm'],
  },
  xvml: {
    mime: 'application/xv+xml',
    extensions: ['.mxml', '.xhvml', '.xvml', '.xvm'],
  },
  xvm: {
    mime: 'application/xv+xml',
    extensions: ['.mxml', '.xhvml', '.xvml', '.xvm'],
  },
  yang: {
    mime: 'application/yang',
    extensions: ['.yang'],
  },
  yin: {
    mime: 'application/yin+xml',
    extensions: ['.yin'],
  },
  zip: {
    mime: 'application/zip',
    extensions: ['.zip'],
  },
  '3gpp': {
    mime: 'video/3gpp',
    extensions: ['.3gp', '.3gpp'],
  },
  adp: {
    mime: 'audio/adpcm',
    extensions: ['.adp'],
  },
  amr: {
    mime: 'audio/amr',
    extensions: ['.amr'],
  },
  au: {
    mime: 'audio/basic',
    extensions: ['.au', '.snd'],
  },
  snd: {
    mime: 'audio/basic',
    extensions: ['.au', '.snd'],
  },
  mid: {
    mime: 'audio/midi',
    extensions: ['.mid', '.midi', '.kar', '.rmi'],
  },
  midi: {
    mime: 'audio/midi',
    extensions: ['.mid', '.midi', '.kar', '.rmi'],
  },
  kar: {
    mime: 'audio/midi',
    extensions: ['.mid', '.midi', '.kar', '.rmi'],
  },
  rmi: {
    mime: 'audio/midi',
    extensions: ['.mid', '.midi', '.kar', '.rmi'],
  },
  mxmf: {
    mime: 'audio/mobile-xmf',
    extensions: ['.mxmf'],
  },
  mp3: {
    mime: 'audio/mpeg',
    extensions: ['.mpga', '.mp2', '.mp2a', '.mp3', '.m2a', '.m3a'],
  },
  m4a: {
    mime: 'audio/mp4',
    extensions: ['.m4a', '.mp4a'],
  },
  mp4a: {
    mime: 'audio/mp4',
    extensions: ['.m4a', '.mp4a'],
  },
  mpga: {
    mime: 'audio/mpeg',
    extensions: ['.mpga', '.mp2', '.mp2a', '.mp3', '.m2a', '.m3a'],
  },
  mp2: {
    mime: 'audio/mpeg',
    extensions: ['.mpga', '.mp2', '.mp2a', '.mp3', '.m2a', '.m3a'],
  },
  mp2a: {
    mime: 'audio/mpeg',
    extensions: ['.mpga', '.mp2', '.mp2a', '.mp3', '.m2a', '.m3a'],
  },
  m2a: {
    mime: 'audio/mpeg',
    extensions: ['.mpga', '.mp2', '.mp2a', '.mp3', '.m2a', '.m3a'],
  },
  m3a: {
    mime: 'audio/mpeg',
    extensions: ['.mpga', '.mp2', '.mp2a', '.mp3', '.m2a', '.m3a'],
  },
  oga: {
    mime: 'audio/ogg',
    extensions: ['.oga', '.ogg', '.spx', '.opus'],
  },
  ogg: {
    mime: 'audio/ogg',
    extensions: ['.oga', '.ogg', '.spx', '.opus'],
  },
  spx: {
    mime: 'audio/ogg',
    extensions: ['.oga', '.ogg', '.spx', '.opus'],
  },
  opus: {
    mime: 'audio/ogg',
    extensions: ['.oga', '.ogg', '.spx', '.opus'],
  },
  s3m: {
    mime: 'audio/s3m',
    extensions: ['.s3m'],
  },
  sil: {
    mime: 'audio/silk',
    extensions: ['.sil'],
  },
  uva: {
    mime: 'audio/vnd.dece.audio',
    extensions: ['.uva', '.uvva'],
  },
  uvva: {
    mime: 'audio/vnd.dece.audio',
    extensions: ['.uva', '.uvva'],
  },
  eol: {
    mime: 'audio/vnd.digital-winds',
    extensions: ['.eol'],
  },
  dra: {
    mime: 'audio/vnd.dra',
    extensions: ['.dra'],
  },
  dts: {
    mime: 'audio/vnd.dts',
    extensions: ['.dts'],
  },
  dtshd: {
    mime: 'audio/vnd.dts.hd',
    extensions: ['.dtshd'],
  },
  lvp: {
    mime: 'audio/vnd.lucent.voice',
    extensions: ['.lvp'],
  },
  pya: {
    mime: 'audio/vnd.ms-playready.media.pya',
    extensions: ['.pya'],
  },
  ecelp4800: {
    mime: 'audio/vnd.nuera.ecelp4800',
    extensions: ['.ecelp4800'],
  },
  ecelp7470: {
    mime: 'audio/vnd.nuera.ecelp7470',
    extensions: ['.ecelp7470'],
  },
  ecelp9600: {
    mime: 'audio/vnd.nuera.ecelp9600',
    extensions: ['.ecelp9600'],
  },
  rip: {
    mime: 'audio/vnd.rip',
    extensions: ['.rip'],
  },
  wav: {
    mime: 'audio/wave',
    extensions: ['.wav'],
  },
  weba: {
    mime: 'audio/webm',
    extensions: ['.weba'],
  },
  aac: {
    mime: 'audio/x-aac',
    extensions: ['.aac'],
  },
  aif: {
    mime: 'audio/x-aiff',
    extensions: ['.aif', '.aiff', '.aifc'],
  },
  aiff: {
    mime: 'audio/x-aiff',
    extensions: ['.aif', '.aiff', '.aifc'],
  },
  aifc: {
    mime: 'audio/x-aiff',
    extensions: ['.aif', '.aiff', '.aifc'],
  },
  caf: {
    mime: 'audio/x-caf',
    extensions: ['.caf'],
  },
  flac: {
    mime: 'audio/x-flac',
    extensions: ['.flac'],
  },
  mka: {
    mime: 'audio/x-matroska',
    extensions: ['.mka'],
  },
  m3u: {
    mime: 'audio/x-mpegurl',
    extensions: ['.m3u'],
  },
  wax: {
    mime: 'audio/x-ms-wax',
    extensions: ['.wax'],
  },
  wma: {
    mime: 'audio/x-ms-wma',
    extensions: ['.wma'],
  },
  ram: {
    mime: 'audio/x-pn-realaudio',
    extensions: ['.ram', '.ra'],
  },
  ra: {
    mime: 'audio/x-pn-realaudio',
    extensions: ['.ram', '.ra'],
  },
  rmp: {
    mime: 'audio/x-pn-realaudio-plugin',
    extensions: ['.rmp'],
  },
  xm: {
    mime: 'audio/xm',
    extensions: ['.xm'],
  },
  cdx: {
    mime: 'chemical/x-cdx',
    extensions: ['.cdx'],
  },
  cif: {
    mime: 'chemical/x-cif',
    extensions: ['.cif'],
  },
  cmdf: {
    mime: 'chemical/x-cmdf',
    extensions: ['.cmdf'],
  },
  cml: {
    mime: 'chemical/x-cml',
    extensions: ['.cml'],
  },
  csml: {
    mime: 'chemical/x-csml',
    extensions: ['.csml'],
  },
  xyz: {
    mime: 'chemical/x-xyz',
    extensions: ['.xyz'],
  },
  ttc: {
    mime: 'font/collection',
    extensions: ['.ttc'],
  },
  otf: {
    mime: 'font/otf',
    extensions: ['.otf'],
  },
  ttf: {
    mime: 'font/ttf',
    extensions: ['.ttf'],
  },
  woff: {
    mime: 'font/woff',
    extensions: ['.woff'],
  },
  woff2: {
    mime: 'font/woff2',
    extensions: ['.woff2'],
  },
  exr: {
    mime: 'image/aces',
    extensions: ['.exr'],
  },
  apng: {
    mime: 'image/apng',
    extensions: ['.apng'],
  },
  avci: {
    mime: 'image/avci',
    extensions: ['.avci'],
  },
  avcs: {
    mime: 'image/avcs',
    extensions: ['.avcs'],
  },
  avif: {
    mime: 'image/avif',
    extensions: ['.avif'],
  },
  bmp: {
    mime: 'image/bmp',
    extensions: ['.bmp'],
  },
  cgm: {
    mime: 'image/cgm',
    extensions: ['.cgm'],
  },
  drle: {
    mime: 'image/dicom-rle',
    extensions: ['.drle'],
  },
  fits: {
    mime: 'image/fits',
    extensions: ['.fits'],
  },
  g3: {
    mime: 'image/g3fax',
    extensions: ['.g3'],
  },
  gif: {
    mime: 'image/gif',
    extensions: ['.gif'],
  },
  heic: {
    mime: 'image/heic',
    extensions: ['.heic'],
  },
  heics: {
    mime: 'image/heic-sequence',
    extensions: ['.heics'],
  },
  heif: {
    mime: 'image/heif',
    extensions: ['.heif'],
  },
  heifs: {
    mime: 'image/heif-sequence',
    extensions: ['.heifs'],
  },
  hej2: {
    mime: 'image/hej2k',
    extensions: ['.hej2'],
  },
  hsj2: {
    mime: 'image/hsj2',
    extensions: ['.hsj2'],
  },
  ief: {
    mime: 'image/ief',
    extensions: ['.ief'],
  },
  jls: {
    mime: 'image/jls',
    extensions: ['.jls'],
  },
  jp2: {
    mime: 'image/jp2',
    extensions: ['.jp2', '.jpg2'],
  },
  jpg2: {
    mime: 'image/jp2',
    extensions: ['.jp2', '.jpg2'],
  },
  jpeg: {
    mime: 'image/jpeg',
    extensions: ['.jpeg', '.jpg', '.jpe'],
  },
  jpg: {
    mime: 'image/jpeg',
    extensions: ['.jpeg', '.jpg', '.jpe'],
  },
  jpe: {
    mime: 'image/jpeg',
    extensions: ['.jpeg', '.jpg', '.jpe'],
  },
  jph: {
    mime: 'image/jph',
    extensions: ['.jph'],
  },
  jhc: {
    mime: 'image/jphc',
    extensions: ['.jhc'],
  },
  jpm: {
    mime: 'image/jpm',
    extensions: ['.jpm'],
  },
  jpx: {
    mime: 'image/jpx',
    extensions: ['.jpx', '.jpf'],
  },
  jpf: {
    mime: 'image/jpx',
    extensions: ['.jpx', '.jpf'],
  },
  jxr: {
    mime: 'image/jxr',
    extensions: ['.jxr'],
  },
  jxra: {
    mime: 'image/jxra',
    extensions: ['.jxra'],
  },
  jxrs: {
    mime: 'image/jxrs',
    extensions: ['.jxrs'],
  },
  jxs: {
    mime: 'image/jxs',
    extensions: ['.jxs'],
  },
  jxsc: {
    mime: 'image/jxsc',
    extensions: ['.jxsc'],
  },
  jxsi: {
    mime: 'image/jxsi',
    extensions: ['.jxsi'],
  },
  jxss: {
    mime: 'image/jxss',
    extensions: ['.jxss'],
  },
  ktx: {
    mime: 'image/ktx',
    extensions: ['.ktx'],
  },
  ktx2: {
    mime: 'image/ktx2',
    extensions: ['.ktx2'],
  },
  png: {
    mime: 'image/png',
    extensions: ['.png'],
  },
  btif: {
    mime: 'image/prs.btif',
    extensions: ['.btif'],
  },
  pti: {
    mime: 'image/prs.pti',
    extensions: ['.pti'],
  },
  sgi: {
    mime: 'image/sgi',
    extensions: ['.sgi'],
  },
  svg: {
    mime: 'image/svg+xml',
    extensions: ['.svg', '.svgz'],
  },
  svgz: {
    mime: 'image/svg+xml',
    extensions: ['.svg', '.svgz'],
  },
  t38: {
    mime: 'image/t38',
    extensions: ['.t38'],
  },
  tif: {
    mime: 'image/tiff',
    extensions: ['.tif', '.tiff'],
  },
  tiff: {
    mime: 'image/tiff',
    extensions: ['.tif', '.tiff'],
  },
  tfx: {
    mime: 'image/tiff-fx',
    extensions: ['.tfx'],
  },
  psd: {
    mime: 'image/vnd.adobe.photoshop',
    extensions: ['.psd'],
  },
  azv: {
    mime: 'image/vnd.airzip.accelerator.azv',
    extensions: ['.azv'],
  },
  uvi: {
    mime: 'image/vnd.dece.graphic',
    extensions: ['.uvi', '.uvvi', '.uvg', '.uvvg'],
  },
  uvvi: {
    mime: 'image/vnd.dece.graphic',
    extensions: ['.uvi', '.uvvi', '.uvg', '.uvvg'],
  },
  uvg: {
    mime: 'image/vnd.dece.graphic',
    extensions: ['.uvi', '.uvvi', '.uvg', '.uvvg'],
  },
  uvvg: {
    mime: 'image/vnd.dece.graphic',
    extensions: ['.uvi', '.uvvi', '.uvg', '.uvvg'],
  },
  djvu: {
    mime: 'image/vnd.djvu',
    extensions: ['.djvu', '.djv'],
  },
  djv: {
    mime: 'image/vnd.djvu',
    extensions: ['.djvu', '.djv'],
  },
  sub: {
    mime: 'text/vnd.dvb.subtitle',
    extensions: ['.sub'],
  },
  dwg: {
    mime: 'image/vnd.dwg',
    extensions: ['.dwg'],
  },
  dxf: {
    mime: 'image/vnd.dxf',
    extensions: ['.dxf'],
  },
  fbs: {
    mime: 'image/vnd.fastbidsheet',
    extensions: ['.fbs'],
  },
  fpx: {
    mime: 'image/vnd.fpx',
    extensions: ['.fpx'],
  },
  fst: {
    mime: 'image/vnd.fst',
    extensions: ['.fst'],
  },
  mmr: {
    mime: 'image/vnd.fujixerox.edmics-mmr',
    extensions: ['.mmr'],
  },
  rlc: {
    mime: 'image/vnd.fujixerox.edmics-rlc',
    extensions: ['.rlc'],
  },
  ico: {
    mime: 'image/vnd.microsoft.icon',
    extensions: ['.ico'],
  },
  dds: {
    mime: 'image/vnd.ms-dds',
    extensions: ['.dds'],
  },
  mdi: {
    mime: 'image/vnd.ms-modi',
    extensions: ['.mdi'],
  },
  wdp: {
    mime: 'image/vnd.ms-photo',
    extensions: ['.wdp'],
  },
  npx: {
    mime: 'image/vnd.net-fpx',
    extensions: ['.npx'],
  },
  b16: {
    mime: 'image/vnd.pco.b16',
    extensions: ['.b16'],
  },
  tap: {
    mime: 'image/vnd.tencent.tap',
    extensions: ['.tap'],
  },
  vtf: {
    mime: 'image/vnd.valve.source.texture',
    extensions: ['.vtf'],
  },
  wbmp: {
    mime: 'image/vnd.wap.wbmp',
    extensions: ['.wbmp'],
  },
  xif: {
    mime: 'image/vnd.xiff',
    extensions: ['.xif'],
  },
  pcx: {
    mime: 'image/vnd.zbrush.pcx',
    extensions: ['.pcx'],
  },
  webp: {
    mime: 'image/webp',
    extensions: ['.webp'],
  },
  '3ds': {
    mime: 'image/x-3ds',
    extensions: ['.3ds'],
  },
  ras: {
    mime: 'image/x-cmu-raster',
    extensions: ['.ras'],
  },
  cmx: {
    mime: 'image/x-cmx',
    extensions: ['.cmx'],
  },
  fh: {
    mime: 'image/x-freehand',
    extensions: ['.fh', '.fhc', '.fh4', '.fh5', '.fh7'],
  },
  fhc: {
    mime: 'image/x-freehand',
    extensions: ['.fh', '.fhc', '.fh4', '.fh5', '.fh7'],
  },
  fh4: {
    mime: 'image/x-freehand',
    extensions: ['.fh', '.fhc', '.fh4', '.fh5', '.fh7'],
  },
  fh5: {
    mime: 'image/x-freehand',
    extensions: ['.fh', '.fhc', '.fh4', '.fh5', '.fh7'],
  },
  fh7: {
    mime: 'image/x-freehand',
    extensions: ['.fh', '.fhc', '.fh4', '.fh5', '.fh7'],
  },
  jng: {
    mime: 'image/x-jng',
    extensions: ['.jng'],
  },
  sid: {
    mime: 'image/x-mrsid-image',
    extensions: ['.sid'],
  },
  pic: {
    mime: 'image/x-pict',
    extensions: ['.pic', '.pct'],
  },
  pct: {
    mime: 'image/x-pict',
    extensions: ['.pic', '.pct'],
  },
  pnm: {
    mime: 'image/x-portable-anymap',
    extensions: ['.pnm'],
  },
  pbm: {
    mime: 'image/x-portable-bitmap',
    extensions: ['.pbm'],
  },
  pgm: {
    mime: 'image/x-portable-zincmap',
    extensions: ['.pgm'],
  },
  ppm: {
    mime: 'image/x-portable-pixmap',
    extensions: ['.ppm'],
  },
  rgb: {
    mime: 'image/x-rgb',
    extensions: ['.rgb'],
  },
  tga: {
    mime: 'image/x-tga',
    extensions: ['.tga'],
  },
  xbm: {
    mime: 'image/x-xbitmap',
    extensions: ['.xbm'],
  },
  xpm: {
    mime: 'image/x-xpixmap',
    extensions: ['.xpm'],
  },
  xwd: {
    mime: 'image/x-xwindowdump',
    extensions: ['.xwd'],
  },
  'disposition-notification': {
    mime: 'message/disposition-notification',
    extensions: ['.disposition-notification'],
  },
  u8msg: {
    mime: 'message/global',
    extensions: ['.u8msg'],
  },
  u8dsn: {
    mime: 'message/global-delivery-status',
    extensions: ['.u8dsn'],
  },
  u8mdn: {
    mime: 'message/global-disposition-notification',
    extensions: ['.u8mdn'],
  },
  u8hdr: {
    mime: 'message/global-headers',
    extensions: ['.u8hdr'],
  },
  eml: {
    mime: 'message/rfc822',
    extensions: ['.eml', '.mime'],
  },
  mime: {
    mime: 'message/rfc822',
    extensions: ['.eml', '.mime'],
  },
  wsc: {
    mime: 'message/vnd.wfa.wsc',
    extensions: ['.wsc'],
  },
  '3mf': {
    mime: 'model/3mf',
    extensions: ['.3mf'],
  },
  gltf: {
    mime: 'model/gltf+json',
    extensions: ['.gltf'],
  },
  glb: {
    mime: 'model/gltf-binary',
    extensions: ['.glb'],
  },
  igs: {
    mime: 'model/iges',
    extensions: ['.igs', '.iges'],
  },
  iges: {
    mime: 'model/iges',
    extensions: ['.igs', '.iges'],
  },
  msh: {
    mime: 'model/mesh',
    extensions: ['.msh', '.mesh', '.silo'],
  },
  mesh: {
    mime: 'model/mesh',
    extensions: ['.msh', '.mesh', '.silo'],
  },
  silo: {
    mime: 'model/mesh',
    extensions: ['.msh', '.mesh', '.silo'],
  },
  mtl: {
    mime: 'model/mtl',
    extensions: ['.mtl'],
  },
  stpx: {
    mime: 'model/step+xml',
    extensions: ['.stpx'],
  },
  stpz: {
    mime: 'model/step+zip',
    extensions: ['.stpz'],
  },
  stpxz: {
    mime: 'model/step-xml+zip',
    extensions: ['.stpxz'],
  },
  dae: {
    mime: 'model/vnd.collada+xml',
    extensions: ['.dae'],
  },
  dwf: {
    mime: 'model/vnd.dwf',
    extensions: ['.dwf'],
  },
  gdl: {
    mime: 'model/vnd.gdl',
    extensions: ['.gdl'],
  },
  gtw: {
    mime: 'model/vnd.gtw',
    extensions: ['.gtw'],
  },
  mts: {
    mime: 'model/vnd.mts',
    extensions: ['.mts'],
  },
  ogex: {
    mime: 'model/vnd.opengex',
    extensions: ['.ogex'],
  },
  x_b: {
    mime: 'model/vnd.parasolid.transmit.binary',
    extensions: ['.x_b'],
  },
  x_t: {
    mime: 'model/vnd.parasolid.transmit.text',
    extensions: ['.x_t'],
  },
  vds: {
    mime: 'model/vnd.sap.vds',
    extensions: ['.vds'],
  },
  usdz: {
    mime: 'model/vnd.usdz+zip',
    extensions: ['.usdz'],
  },
  bsp: {
    mime: 'model/vnd.valve.source.compiled-map',
    extensions: ['.bsp'],
  },
  vtu: {
    mime: 'model/vnd.vtu',
    extensions: ['.vtu'],
  },
  wrl: {
    mime: 'model/vrml',
    extensions: ['.wrl', '.vrml'],
  },
  vrml: {
    mime: 'model/vrml',
    extensions: ['.wrl', '.vrml'],
  },
  x3db: {
    mime: 'model/x3d+fastinfoset',
    extensions: ['.x3db'],
  },
  x3dbz: {
    mime: 'model/x3d+binary',
    extensions: ['.x3db', '.x3dbz'],
  },
  x3dv: {
    mime: 'model/x3d-vrml',
    extensions: ['.x3dv'],
  },
  x3dvz: {
    mime: 'model/x3d+vrml',
    extensions: ['.x3dv', '.x3dvz'],
  },
  x3d: {
    mime: 'model/x3d+xml',
    extensions: ['.x3d', '.x3dz'],
  },
  x3dz: {
    mime: 'model/x3d+xml',
    extensions: ['.x3d', '.x3dz'],
  },
  appcache: {
    mime: 'text/cache-manifest',
    extensions: ['.appcache', '.manifest'],
  },
  manifest: {
    mime: 'text/cache-manifest',
    extensions: ['.appcache', '.manifest'],
  },
  ics: {
    mime: 'text/calendar',
    extensions: ['.ics', '.ifb'],
  },
  ifb: {
    mime: 'text/calendar',
    extensions: ['.ics', '.ifb'],
  },
  coffee: {
    mime: 'text/coffeescript',
    extensions: ['.coffee', '.litcoffee'],
  },
  litcoffee: {
    mime: 'text/coffeescript',
    extensions: ['.coffee', '.litcoffee'],
  },
  css: {
    mime: 'text/css',
    extensions: ['.css'],
  },
  csv: {
    mime: 'text/csv',
    extensions: ['.csv'],
  },
  html: {
    mime: 'text/html',
    extensions: ['.html', '.htm', '.shtml'],
  },
  htm: {
    mime: 'text/html',
    extensions: ['.html', '.htm', '.shtml'],
  },
  shtml: {
    mime: 'text/html',
    extensions: ['.html', '.htm', '.shtml'],
  },
  jade: {
    mime: 'text/jade',
    extensions: ['.jade'],
  },
  jsx: {
    mime: 'text/jsx',
    extensions: ['.jsx'],
  },
  less: {
    mime: 'text/less',
    extensions: ['.less'],
  },
  markdown: {
    mime: 'text/markdown',
    extensions: ['.markdown', '.md'],
  },
  md: {
    mime: 'text/markdown',
    extensions: ['.markdown', '.md'],
  },
  mml: {
    mime: 'text/mathml',
    extensions: ['.mml'],
  },
  mdx: {
    mime: 'text/mdx',
    extensions: ['.mdx'],
  },
  n3: {
    mime: 'text/n3',
    extensions: ['.n3'],
  },
  txt: {
    mime: 'text/plain',
    extensions: [
      '.txt',
      '.text',
      '.conf',
      '.def',
      '.list',
      '.log',
      '.in',
      '.ini',
    ],
  },
  text: {
    mime: 'text/plain',
    extensions: [
      '.txt',
      '.text',
      '.conf',
      '.def',
      '.list',
      '.log',
      '.in',
      '.ini',
    ],
  },
  conf: {
    mime: 'text/plain',
    extensions: [
      '.txt',
      '.text',
      '.conf',
      '.def',
      '.list',
      '.log',
      '.in',
      '.ini',
    ],
  },
  def: {
    mime: 'text/plain',
    extensions: [
      '.txt',
      '.text',
      '.conf',
      '.def',
      '.list',
      '.log',
      '.in',
      '.ini',
    ],
  },
  list: {
    mime: 'text/plain',
    extensions: [
      '.txt',
      '.text',
      '.conf',
      '.def',
      '.list',
      '.log',
      '.in',
      '.ini',
    ],
  },
  log: {
    mime: 'text/plain',
    extensions: [
      '.txt',
      '.text',
      '.conf',
      '.def',
      '.list',
      '.log',
      '.in',
      '.ini',
    ],
  },
  in: {
    mime: 'text/plain',
    extensions: [
      '.txt',
      '.text',
      '.conf',
      '.def',
      '.list',
      '.log',
      '.in',
      '.ini',
    ],
  },
  ini: {
    mime: 'text/plain',
    extensions: [
      '.txt',
      '.text',
      '.conf',
      '.def',
      '.list',
      '.log',
      '.in',
      '.ini',
    ],
  },
  dsc: {
    mime: 'text/prs.lines.tag',
    extensions: ['.dsc'],
  },
  rtx: {
    mime: 'text/richtext',
    extensions: ['.rtx'],
  },
  sgml: {
    mime: 'text/sgml',
    extensions: ['.sgml', '.sgm'],
  },
  sgm: {
    mime: 'text/sgml',
    extensions: ['.sgml', '.sgm'],
  },
  shex: {
    mime: 'text/shex',
    extensions: ['.shex'],
  },
  slim: {
    mime: 'text/slim',
    extensions: ['.slim', '.slm'],
  },
  slm: {
    mime: 'text/slim',
    extensions: ['.slim', '.slm'],
  },
  spdx: {
    mime: 'text/spdx',
    extensions: ['.spdx'],
  },
  stylus: {
    mime: 'text/stylus',
    extensions: ['.stylus', '.styl'],
  },
  styl: {
    mime: 'text/stylus',
    extensions: ['.stylus', '.styl'],
  },
  tsv: {
    mime: 'text/tab-separated-values',
    extensions: ['.tsv'],
  },
  t: {
    mime: 'text/troff',
    extensions: ['.t', '.tr', '.roff', '.man', '.me', '.ms'],
  },
  tr: {
    mime: 'text/troff',
    extensions: ['.t', '.tr', '.roff', '.man', '.me', '.ms'],
  },
  roff: {
    mime: 'text/troff',
    extensions: ['.t', '.tr', '.roff', '.man', '.me', '.ms'],
  },
  man: {
    mime: 'text/troff',
    extensions: ['.t', '.tr', '.roff', '.man', '.me', '.ms'],
  },
  me: {
    mime: 'text/troff',
    extensions: ['.t', '.tr', '.roff', '.man', '.me', '.ms'],
  },
  ms: {
    mime: 'text/troff',
    extensions: ['.t', '.tr', '.roff', '.man', '.me', '.ms'],
  },
  ttl: {
    mime: 'text/turtle',
    extensions: ['.ttl'],
  },
  uri: {
    mime: 'text/uri-list',
    extensions: ['.uri', '.uris', '.urls'],
  },
  uris: {
    mime: 'text/uri-list',
    extensions: ['.uri', '.uris', '.urls'],
  },
  urls: {
    mime: 'text/uri-list',
    extensions: ['.uri', '.uris', '.urls'],
  },
  vcard: {
    mime: 'text/vcard',
    extensions: ['.vcard'],
  },
  curl: {
    mime: 'text/vnd.curl',
    extensions: ['.curl'],
  },
  dcurl: {
    mime: 'text/vnd.curl.dcurl',
    extensions: ['.dcurl'],
  },
  mcurl: {
    mime: 'text/vnd.curl.mcurl',
    extensions: ['.mcurl'],
  },
  scurl: {
    mime: 'text/vnd.curl.scurl',
    extensions: ['.scurl'],
  },
  ged: {
    mime: 'text/vnd.familysearch.gedcom',
    extensions: ['.ged'],
  },
  fly: {
    mime: 'text/vnd.fly',
    extensions: ['.fly'],
  },
  flx: {
    mime: 'text/vnd.fmi.flexstor',
    extensions: ['.flx'],
  },
  gv: {
    mime: 'text/vnd.graphviz',
    extensions: ['.gv'],
  },
  '3dml': {
    mime: 'text/vnd.in3d.3dml',
    extensions: ['.3dml'],
  },
  spot: {
    mime: 'text/vnd.in3d.spot',
    extensions: ['.spot'],
  },
  jad: {
    mime: 'text/vnd.sun.j2me.app-descriptor',
    extensions: ['.jad'],
  },
  wml: {
    mime: 'text/vnd.wap.wml',
    extensions: ['.wml'],
  },
  wmls: {
    mime: 'text/vnd.wap.wmlscript',
    extensions: ['.wmls'],
  },
  vtt: {
    mime: 'text/vtt',
    extensions: ['.vtt'],
  },
  s: {
    mime: 'text/x-asm',
    extensions: ['.s', '.asm'],
  },
  asm: {
    mime: 'text/x-asm',
    extensions: ['.s', '.asm'],
  },
  c: {
    mime: 'text/x-c',
    extensions: ['.c', '.cc', '.cxx', '.cpp', '.h', '.hh', '.dic'],
  },
  cc: {
    mime: 'text/x-c',
    extensions: ['.c', '.cc', '.cxx', '.cpp', '.h', '.hh', '.dic'],
  },
  cxx: {
    mime: 'text/x-c',
    extensions: ['.c', '.cc', '.cxx', '.cpp', '.h', '.hh', '.dic'],
  },
  cpp: {
    mime: 'text/x-c',
    extensions: ['.c', '.cc', '.cxx', '.cpp', '.h', '.hh', '.dic'],
  },
  h: {
    mime: 'text/x-c',
    extensions: ['.c', '.cc', '.cxx', '.cpp', '.h', '.hh', '.dic'],
  },
  hh: {
    mime: 'text/x-c',
    extensions: ['.c', '.cc', '.cxx', '.cpp', '.h', '.hh', '.dic'],
  },
  dic: {
    mime: 'text/x-c',
    extensions: ['.c', '.cc', '.cxx', '.cpp', '.h', '.hh', '.dic'],
  },
  htc: {
    mime: 'text/x-component',
    extensions: ['.htc'],
  },
  f: {
    mime: 'text/x-fortran',
    extensions: ['.f', '.for', '.f77', '.f90'],
  },
  for: {
    mime: 'text/x-fortran',
    extensions: ['.f', '.for', '.f77', '.f90'],
  },
  f77: {
    mime: 'text/x-fortran',
    extensions: ['.f', '.for', '.f77', '.f90'],
  },
  f90: {
    mime: 'text/x-fortran',
    extensions: ['.f', '.for', '.f77', '.f90'],
  },
  hbs: {
    mime: 'text/x-handlebars-template',
    extensions: ['.hbs'],
  },
  java: {
    mime: 'text/x-java-source',
    extensions: ['.java'],
  },
  lua: {
    mime: 'text/x-lua',
    extensions: ['.lua'],
  },
  mkd: {
    mime: 'text/x-markdown',
    extensions: ['.mkd'],
  },
  nfo: {
    mime: 'text/x-nfo',
    extensions: ['.nfo'],
  },
  opml: {
    mime: 'text/x-opml',
    extensions: ['.opml'],
  },
  p: {
    mime: 'text/x-pascal',
    extensions: ['.p', '.pas'],
  },
  pas: {
    mime: 'text/x-pascal',
    extensions: ['.p', '.pas'],
  },
  pde: {
    mime: 'text/x-processing',
    extensions: ['.pde'],
  },
  sass: {
    mime: 'text/x-sass',
    extensions: ['.sass'],
  },
  scss: {
    mime: 'text/x-scss',
    extensions: ['.scss'],
  },
  etx: {
    mime: 'text/x-setext',
    extensions: ['.etx'],
  },
  sfv: {
    mime: 'text/x-sfv',
    extensions: ['.sfv'],
  },
  ymp: {
    mime: 'text/x-suse-ymp',
    extensions: ['.ymp'],
  },
  uu: {
    mime: 'text/x-uuencode',
    extensions: ['.uu'],
  },
  vcs: {
    mime: 'text/x-vcalendar',
    extensions: ['.vcs'],
  },
  vcf: {
    mime: 'text/x-vcard',
    extensions: ['.vcf'],
  },
  yaml: {
    mime: 'text/yaml',
    extensions: ['.yaml', '.yml'],
  },
  yml: {
    mime: 'text/yaml',
    extensions: ['.yaml', '.yml'],
  },
  '3gp': {
    mime: 'video/3gpp',
    extensions: ['.3gp', '.3gpp'],
  },
  '3g2': {
    mime: 'video/3gpp2',
    extensions: ['.3g2'],
  },
  h261: {
    mime: 'video/h261',
    extensions: ['.h261'],
  },
  h263: {
    mime: 'video/h263',
    extensions: ['.h263'],
  },
  h264: {
    mime: 'video/h264',
    extensions: ['.h264'],
  },
  m4s: {
    mime: 'video/iso.segment',
    extensions: ['.m4s'],
  },
  jpgv: {
    mime: 'video/jpeg',
    extensions: ['.jpgv'],
  },
  jpgm: {
    mime: 'video/jpm',
    extensions: ['.jpm', '.jpgm'],
  },
  mj2: {
    mime: 'video/mj2',
    extensions: ['.mj2', '.mjp2'],
  },
  mjp2: {
    mime: 'video/mj2',
    extensions: ['.mj2', '.mjp2'],
  },
  ts: {
    mime: 'video/mp2t',
    extensions: ['.ts'],
  },
  mp4: {
    mime: 'video/mp4',
    extensions: ['.mp4', '.mp4v', '.mpg4'],
  },
  mp4v: {
    mime: 'video/mp4',
    extensions: ['.mp4', '.mp4v', '.mpg4'],
  },
  mpg4: {
    mime: 'video/mp4',
    extensions: ['.mp4', '.mp4v', '.mpg4'],
  },
  mpeg: {
    mime: 'video/mpeg',
    extensions: ['.mpeg', '.mpg', '.mpe', '.m1v', '.m2v'],
  },
  mpg: {
    mime: 'video/mpeg',
    extensions: ['.mpeg', '.mpg', '.mpe', '.m1v', '.m2v'],
  },
  mpe: {
    mime: 'video/mpeg',
    extensions: ['.mpeg', '.mpg', '.mpe', '.m1v', '.m2v'],
  },
  m1v: {
    mime: 'video/mpeg',
    extensions: ['.mpeg', '.mpg', '.mpe', '.m1v', '.m2v'],
  },
  m2v: {
    mime: 'video/mpeg',
    extensions: ['.mpeg', '.mpg', '.mpe', '.m1v', '.m2v'],
  },
  ogv: {
    mime: 'video/ogg',
    extensions: ['.ogv'],
  },
  qt: {
    mime: 'video/quicktime',
    extensions: ['.qt', '.mov'],
  },
  mov: {
    mime: 'video/quicktime',
    extensions: ['.qt', '.mov'],
  },
  uvh: {
    mime: 'video/vnd.dece.hd',
    extensions: ['.uvh', '.uvvh'],
  },
  uvvh: {
    mime: 'video/vnd.dece.hd',
    extensions: ['.uvh', '.uvvh'],
  },
  uvm: {
    mime: 'video/vnd.dece.mobile',
    extensions: ['.uvm', '.uvvm'],
  },
  uvvm: {
    mime: 'video/vnd.dece.mobile',
    extensions: ['.uvm', '.uvvm'],
  },
  uvp: {
    mime: 'video/vnd.dece.pd',
    extensions: ['.uvp', '.uvvp'],
  },
  uvvp: {
    mime: 'video/vnd.dece.pd',
    extensions: ['.uvp', '.uvvp'],
  },
  uvs: {
    mime: 'video/vnd.dece.sd',
    extensions: ['.uvs', '.uvvs'],
  },
  uvvs: {
    mime: 'video/vnd.dece.sd',
    extensions: ['.uvs', '.uvvs'],
  },
  uvv: {
    mime: 'video/vnd.dece.video',
    extensions: ['.uvv', '.uvvv'],
  },
  uvvv: {
    mime: 'video/vnd.dece.video',
    extensions: ['.uvv', '.uvvv'],
  },
  dvb: {
    mime: 'video/vnd.dvb.file',
    extensions: ['.dvb'],
  },
  fvt: {
    mime: 'video/vnd.fvt',
    extensions: ['.fvt'],
  },
  mxu: {
    mime: 'video/vnd.mpegurl',
    extensions: ['.mxu', '.m4u'],
  },
  m4u: {
    mime: 'video/vnd.mpegurl',
    extensions: ['.mxu', '.m4u'],
  },
  pyv: {
    mime: 'video/vnd.ms-playready.media.pyv',
    extensions: ['.pyv'],
  },
  uvu: {
    mime: 'video/vnd.uvvu.mp4',
    extensions: ['.uvu', '.uvvu'],
  },
  uvvu: {
    mime: 'video/vnd.uvvu.mp4',
    extensions: ['.uvu', '.uvvu'],
  },
  viv: {
    mime: 'video/vnd.vivo',
    extensions: ['.viv'],
  },
  webm: {
    mime: 'video/webm',
    extensions: ['.webm'],
  },
  f4v: {
    mime: 'video/x-f4v',
    extensions: ['.f4v'],
  },
  fli: {
    mime: 'video/x-fli',
    extensions: ['.fli'],
  },
  flv: {
    mime: 'video/x-flv',
    extensions: ['.flv'],
  },
  m4v: {
    mime: 'video/x-m4v',
    extensions: ['.m4v'],
  },
  mkv: {
    mime: 'video/x-matroska',
    extensions: ['.mkv', '.mk3d', '.mks'],
  },
  mk3d: {
    mime: 'video/x-matroska',
    extensions: ['.mkv', '.mk3d', '.mks'],
  },
  mks: {
    mime: 'video/x-matroska',
    extensions: ['.mkv', '.mk3d', '.mks'],
  },
  mng: {
    mime: 'video/x-mng',
    extensions: ['.mng'],
  },
  asf: {
    mime: 'video/x-ms-asf',
    extensions: ['.asf', '.asx'],
  },
  asx: {
    mime: 'video/x-ms-asf',
    extensions: ['.asf', '.asx'],
  },
  vob: {
    mime: 'video/x-ms-vob',
    extensions: ['.vob'],
  },
  wm: {
    mime: 'video/x-ms-wm',
    extensions: ['.wm'],
  },
  wmv: {
    mime: 'video/x-ms-wmv',
    extensions: ['.wmv'],
  },
  wmx: {
    mime: 'video/x-ms-wmx',
    extensions: ['.wmx'],
  },
  wvx: {
    mime: 'video/x-ms-wvx',
    extensions: ['.wvx'],
  },
  avi: {
    mime: 'video/x-msvideo',
    extensions: ['.avi'],
  },
  movie: {
    mime: 'video/x-sgi-movie',
    extensions: ['.movie'],
  },
  smv: {
    mime: 'video/x-smv',
    extensions: ['.smv'],
  },
  ice: {
    mime: 'x-conference/x-cooltalk',
    extensions: ['.ice'],
  },
}

export default MIME_TYPE
