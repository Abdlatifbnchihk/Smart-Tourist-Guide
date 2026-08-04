export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center px-6">
      <div className="w-16 h-16 mx-auto mb-5 bg-slate-100 rounded-full flex items-center justify-center">
        <span className="text-teal-600">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}