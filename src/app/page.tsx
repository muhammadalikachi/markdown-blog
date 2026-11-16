import PostBrowser from "@/components/PostBrowser";
import { getPublishedPosts, getAllTags } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const posts = getPublishedPosts();
  const tags = getAllTags();

  return (
    <>
      <section className="hero">
        <h1>Latest posts</h1>
        <p>Thoughts, notes and tutorials — straight from Markdown files.</p>
      </section>
      <PostBrowser
        posts={posts.map(({ slug, title, date, tags, draft, excerpt }) => ({
          slug,
          title,
          date,
          tags,
          draft,
          excerpt,
        }))}
        tags={tags}
      />
    </>
  );
}
