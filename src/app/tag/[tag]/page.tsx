import PostBrowser from "@/components/PostBrowser";
import { getPublishedPosts, getAllTags } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

interface Params {
  params: { tag: string };
}

export async function generateMetadata({ params }: Params) {
  return { title: `Posts tagged "${params.tag}"` };
}

export default function TagPage({ params }: Params) {
  const tag = params.tag;
  const all = getPublishedPosts();
  const posts = all.filter((p) => p.tags.includes(tag));

  return (
    <>
      <section className="hero">
        <h1>#{tag}</h1>
        <p>
          {posts.length} post{posts.length === 1 ? "" : "s"} ·{" "}
          <a href="/">All posts on {SITE_NAME}</a>
        </p>
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
        tags={getAllTags().filter((t) => t.tag !== tag)}
        initialTag={tag}
      />
    </>
  );
}
