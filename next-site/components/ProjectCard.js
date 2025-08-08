import Link from 'next/link'

export default function ProjectCard({ slug, title, excerpt, image }) {
  return (
    <div className="border rounded overflow-hidden flex flex-col">
      {image && <img src={image} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-4 flex-1">{excerpt}</p>
        <Link href={`/projetos/${slug}`} className="text-blue-600 font-medium mt-auto">Ver detalhes</Link>
      </div>
    </div>
  )
}
