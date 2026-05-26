import Link from 'next/link'

export default function ProjectCard({ slug, title, excerpt, image }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200/80 shadow-sm hover:shadow-md transition duration-300 flex flex-col group">
      {image && (
        <div className="h-48 overflow-hidden relative shrink-0">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500' }}
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-blue-600 transition leading-tight">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 font-light">
          {excerpt}
        </p>
        <Link 
          href={`/projetos/${slug}`} 
          className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:underline mt-auto"
        >
          Ver detalhes do projeto ➔
        </Link>
      </div>
    </div>
  )
}
