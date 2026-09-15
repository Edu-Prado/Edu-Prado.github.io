import Link from "next/link";

export default function ArticleCard({ post, featured = false }) {
  const minutes = post.readingMinutes || Math.max(
    1,
    Math.ceil((post.content || "").split(/\s+/).length / 200),
  );
  const date = new Date(post.created_at);
  return (
    <article className={`article-card${featured ? " article-featured" : ""}`}>
      {post.image_url && (
        <Link
          href={`/blog/${post.slug}`}
          className="article-image"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={post.image_url}
            alt=""
            loading="lazy"
            width="720"
            height="420"
          />
        </Link>
      )}
      <div className="article-card-body">
        <p className="article-meta">
          {post.category || post.tag || "IA aplicada"}{" "}
          <span>· {minutes} min de leitura</span>
        </p>
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p className="article-excerpt">{post.excerpt}</p>}
        <div className="article-card-bottom">
          {!Number.isNaN(date.getTime()) && (
            <time dateTime={date.toISOString()}>
              {date.toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          )}
          <Link href={`/blog/${post.slug}`} aria-label={`Ler: ${post.title}`}>
            Ler artigo <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
