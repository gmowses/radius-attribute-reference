import { useState, useEffect } from 'react'
import { Sun, Moon, Languages, Search, Radio } from 'lucide-react'

const translations = {
  en: {
    title: 'RADIUS Attribute Reference',
    subtitle: 'Standard and vendor-specific RADIUS attributes for ISP deployments. RFC 2865, 2866.',
    search: 'Search attributes...',
    allVendors: 'All vendors',
    standard: 'Standard',
    vendor: 'Vendor',
    attrId: 'Attr ID',
    name: 'Name',
    type: 'Type',
    description: 'Description',
    example: 'Example',
    noResults: 'No attributes found.',
    rfcNote: 'RFC 2865 (RADIUS), RFC 2866 (Accounting), RFC 2869 (RADIUS extensions)',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Referencia de Atributos RADIUS',
    subtitle: 'Atributos RADIUS padrao e vendor-specific para ISPs. RFC 2865, 2866.',
    search: 'Buscar atributos...',
    allVendors: 'Todos os vendors',
    standard: 'Padrao',
    vendor: 'Vendor',
    attrId: 'Attr ID',
    name: 'Nome',
    type: 'Tipo',
    description: 'Descricao',
    example: 'Exemplo',
    noResults: 'Nenhum atributo encontrado.',
    rfcNote: 'RFC 2865 (RADIUS), RFC 2866 (Accounting), RFC 2869 (extensoes RADIUS)',
    builtBy: 'Criado por',
  },
} as const

type Lang = keyof typeof translations

interface Attribute {
  id: string
  name: string
  type: string
  vendor: string
  description: string
  example: string
}

const ATTRIBUTES: Attribute[] = [
  // Standard RFC 2865
  { id: '1', name: 'User-Name', type: 'String', vendor: 'Standard', description: 'Indicates the name of the user being authenticated. Used in Access-Request.', example: 'user@isp.com' },
  { id: '2', name: 'User-Password', type: 'String (encrypted)', vendor: 'Standard', description: 'Password of the user being authenticated (MD5 obfuscated). Access-Request only.', example: '(encrypted)' },
  { id: '3', name: 'CHAP-Password', type: 'String', vendor: 'Standard', description: 'CHAP response when CHAP authentication is used instead of PAP.', example: '(binary)' },
  { id: '4', name: 'NAS-IP-Address', type: 'IP Address', vendor: 'Standard', description: 'IP address of the NAS sending the request. Identifies the access server.', example: '192.168.1.1' },
  { id: '5', name: 'NAS-Port', type: 'Integer', vendor: 'Standard', description: 'Physical port of the NAS (slot/port). Used for audit and logging.', example: '0' },
  { id: '6', name: 'Service-Type', type: 'Integer', vendor: 'Standard', description: 'Type of service requested. 2=Framed (PPP), 5=Outbound, 8=Authenticate-Only.', example: '2 (Framed)' },
  { id: '7', name: 'Framed-Protocol', type: 'Integer', vendor: 'Standard', description: 'Framing used for Framed access. 1=PPP, 2=SLIP, 7=PPPoE.', example: '1 (PPP)' },
  { id: '8', name: 'Framed-IP-Address', type: 'IP Address', vendor: 'Standard', description: 'IP address to be configured for user (Access-Accept). 255.255.255.254 = assigned by NAS.', example: '203.0.113.10' },
  { id: '9', name: 'Framed-IP-Netmask', type: 'IP Address', vendor: 'Standard', description: 'Subnet mask for the Framed-IP-Address. Sent in Access-Accept.', example: '255.255.255.0' },
  { id: '11', name: 'Filter-Id', type: 'String', vendor: 'Standard', description: 'Name of a filter list to apply. Used to reference ACLs on the NAS.', example: 'input-filter' },
  { id: '22', name: 'Framed-Route', type: 'String', vendor: 'Standard', description: 'Routing info to install. Format: prefix gateway metric.', example: '10.0.0.0/8 0.0.0.0 1' },
  { id: '25', name: 'Class', type: 'String', vendor: 'Standard', description: 'Used to correlate authentication with accounting. NAS must echo back in accounting.', example: 'premium-class' },
  { id: '26', name: 'Vendor-Specific', type: 'String', vendor: 'Standard', description: 'Encapsulates vendor proprietary attributes. VSA container. Enterprise ID sub-attributes.', example: '(vendor-id + sub-attr)' },
  { id: '27', name: 'Session-Timeout', type: 'Integer', vendor: 'Standard', description: 'Maximum number of seconds a session may remain active. After expiry, session is terminated.', example: '86400' },
  { id: '28', name: 'Idle-Timeout', type: 'Integer', vendor: 'Standard', description: 'Maximum idle time (no data) in seconds before session is disconnected.', example: '3600' },
  { id: '32', name: 'NAS-Identifier', type: 'String', vendor: 'Standard', description: 'String identifier for the NAS. Used when NAS-IP is ambiguous or NAT.', example: 'bng-01.pop-sp' },
  { id: '40', name: 'Acct-Status-Type', type: 'Integer', vendor: 'Standard', description: 'Accounting status. 1=Start, 2=Stop, 3=Interim-Update. Core accounting attribute.', example: '1 (Start)' },
  { id: '41', name: 'Acct-Delay-Time', type: 'Integer', vendor: 'Standard', description: 'Seconds client has been waiting to send this accounting record.', example: '0' },
  { id: '42', name: 'Acct-Input-Octets', type: 'Integer', vendor: 'Standard', description: 'Bytes received from user during session (upload from subscriber perspective).', example: '1073741824' },
  { id: '43', name: 'Acct-Output-Octets', type: 'Integer', vendor: 'Standard', description: 'Bytes sent to user during session (download from subscriber perspective).', example: '5368709120' },
  { id: '44', name: 'Acct-Session-Id', type: 'String', vendor: 'Standard', description: 'Unique identifier for an accounting session. Must be unique per NAS restart.', example: '00001234' },
  { id: '46', name: 'Acct-Session-Time', type: 'Integer', vendor: 'Standard', description: 'Elapsed seconds the user has been connected. Sent in Stop and Interim records.', example: '3600' },
  { id: '61', name: 'NAS-Port-Type', type: 'Integer', vendor: 'Standard', description: 'Physical port type. 5=Virtual, 15=Ethernet, 32=PPPoE, 33=ATM.', example: '32 (PPPoE)' },
  { id: '85', name: 'Acct-Interim-Interval', type: 'Integer', vendor: 'Standard', description: 'Seconds between interim accounting updates. Typical ISP: 300-600.', example: '300' },
  { id: '87', name: 'NAS-Port-Id', type: 'String', vendor: 'Standard', description: 'Text version of NAS-Port. Describes port in human-readable form.', example: 'ether1' },
  // Framed-Pool
  { id: '88', name: 'Framed-Pool', type: 'String', vendor: 'Standard', description: 'Name of IP pool from which to assign address. NAS assigns from named pool.', example: 'pool-residential' },
  // MikroTik VSA
  { id: 'MT:1', name: 'Mikrotik-Rate-Limit', type: 'String', vendor: 'MikroTik', description: 'Bandwidth limit in format Rx/Tx. Supports burst: Rx/Tx Rx-Burst/Tx-Burst.', example: '10M/50M 20M/100M' },
  { id: 'MT:2', name: 'Mikrotik-Group', type: 'String', vendor: 'MikroTik', description: 'PPP group to assign the user to. References a group defined in /ppp profile.', example: 'subscribers' },
  { id: 'MT:3', name: 'Mikrotik-Wireless-Forward', type: 'Integer', vendor: 'MikroTik', description: 'Allow or deny station-to-station forwarding on wireless.', example: '1' },
  { id: 'MT:8', name: 'Mikrotik-Address-List', type: 'String', vendor: 'MikroTik', description: 'Add subscriber IP to a firewall address-list on connect. Useful for policy routing.', example: 'premium-users' },
  { id: 'MT:12', name: 'Mikrotik-Queue-Type', type: 'String', vendor: 'MikroTik', description: 'Queue type to use for PCQ shaping. References queue type defined on router.', example: 'default-small' },
  // Huawei VSA
  { id: 'HW:1', name: 'Huawei-Input-Average-Rate', type: 'Integer', vendor: 'Huawei', description: 'Committed information rate (CIR) for upstream traffic in bps.', example: '10000000' },
  { id: 'HW:2', name: 'Huawei-Input-Peak-Rate', type: 'Integer', vendor: 'Huawei', description: 'Peak information rate (PIR) for upstream traffic in bps.', example: '20000000' },
  { id: 'HW:3', name: 'Huawei-Output-Average-Rate', type: 'Integer', vendor: 'Huawei', description: 'CIR for downstream traffic in bps. Core attribute for Huawei BNG rate limiting.', example: '50000000' },
  { id: 'HW:4', name: 'Huawei-Output-Peak-Rate', type: 'Integer', vendor: 'Huawei', description: 'PIR for downstream traffic in bps.', example: '100000000' },
  { id: 'HW:26', name: 'Huawei-VPN-Instance', type: 'String', vendor: 'Huawei', description: 'VPN instance (VRF) to bind user session to. Used for L3VPN subscriber isolation.', example: 'residential' },
  // Cisco VSA
  { id: 'Cisco:1', name: 'Cisco-AVPair', type: 'String', vendor: 'Cisco', description: 'Generic Cisco attribute-value pair. Most flexible Cisco VSA. Format: attr=value.', example: 'ip:sub-policy-In=PLAN-10M' },
  { id: 'Cisco:2', name: 'Cisco-NAS-Port', type: 'String', vendor: 'Cisco', description: 'Extended NAS port identification for Cisco IOS/IOS-XE platforms.', example: 'Gi0/0/0.100' },
]

const VENDORS = ['Standard', 'MikroTik', 'Huawei', 'Cisco']

const VENDOR_COLORS: Record<string, string> = {
  Standard: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  MikroTik: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Huawei: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  Cisco: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
}

export default function RADIUSAttributeReference() {
  const [lang, setLang] = useState<Lang>(() => (navigator.language.startsWith('pt') ? 'pt' : 'en'))
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [search, setSearch] = useState('')
  const [vendorFilter, setVendorFilter] = useState('All')

  const t = translations[lang]

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const filtered = ATTRIBUTES.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    const matchVendor = vendorFilter === 'All' || a.vendor === vendorFilter
    return matchSearch && matchVendor
  })

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Radio size={18} className="text-white" />
            </div>
            <span className="font-semibold">RADIUS Reference</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/radius-attribute-reference" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-52">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t.search}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {['All', ...VENDORS].map(v => (
                <button
                  key={v}
                  onClick={() => setVendorFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${vendorFilter === v ? 'bg-purple-500 text-white border-purple-500' : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                >
                  {v === 'All' ? t.allVendors : v}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-zinc-400">{filtered.length} attributes</div>

          {/* Table */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-900">
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    {[t.attrId, t.vendor, t.name, t.type, t.description, t.example].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] uppercase tracking-wide text-zinc-400 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900/50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-zinc-400">{t.noResults}</td></tr>
                  ) : filtered.map(attr => (
                    <tr key={attr.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">{attr.id}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${VENDOR_COLORS[attr.vendor] ?? ''}`}>{attr.vendor}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">{attr.name}</td>
                      <td className="py-3 px-4 text-xs text-zinc-500 whitespace-nowrap">{attr.type}</td>
                      <td className="py-3 px-4 text-xs text-zinc-600 dark:text-zinc-400 max-w-xs">{attr.description}</td>
                      <td className="py-3 px-4 font-mono text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{attr.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400">{t.rfcNote}</p>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-purple-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
