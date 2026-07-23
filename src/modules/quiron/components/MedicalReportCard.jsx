export default function MedicalReportCard({ title, date, status, notes }) {
  return (
    <article className="bg-white/5 border border-quiron-blue/40 rounded-lg overflow-hidden">
      <div className="bg-quiron-blue/20 px-4 py-2 flex justify-between items-center gap-2">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <span className="text-xs bg-quiron-blue text-white px-2 py-0.5 rounded shrink-0">
          {status}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-white/40 text-xs">Fecha: {date}</p>
        <p className="text-white/80 text-sm leading-relaxed">{notes}</p>
        <div className="border-t border-white/10 pt-2 flex gap-4 text-xs text-white/30">
          <span>Dr. IA Nutricional</span>
          <span>Ref: QS-{Date.now().toString().slice(-6)}</span>
        </div>
      </div>
    </article>
  )
}
