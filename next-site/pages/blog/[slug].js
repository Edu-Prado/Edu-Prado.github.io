import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Post from '../../components/Post'
import { posts } from '../../data/posts'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  const post = posts.find(p => p.slug === slug)

  if (!post) return null

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <Post post={post} />
      </main>
      <Footer />
    </>
  )
}
