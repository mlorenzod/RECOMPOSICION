const TAB_STYLES = {
  scuderia: {
    bg: 'bg-scuderia-bg',
    active: 'border-scuderia-red text-scuderia-yellow',
  },
  quiron: {
    bg: 'bg-quiron-bg',
    active: 'border-quiron-blue text-white',
  },
  adobe: {
    bg: 'bg-adobe-bg',
    active: 'border-adobe-accent text-white',
  },
}

export default function TabNavigation({ tabs, activeTab, onChange }) {
  const navBg = TAB_STYLES[activeTab]?.bg ?? 'bg-scuderia-bg'

  return (
    <nav className={`flex border-t border-white/10 ${navBg}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const style = TAB_STYLES[tab.id]

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              flex-1 py-3 text-sm font-semibold transition-all
              ${isActive
                ? `border-b-2 opacity-100 ${style.active}`
                : 'opacity-50 hover:opacity-80 border-b-2 border-transparent text-white/70'}
            `}
          >
            <span className="block text-lg" aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
