import { Metadata } from "next";
import ErrorPage from "@/components/external-post/error";
import PostView from "./post-view";
import { getPost } from "./get-post";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "Blog Not Found | Glyph",
      description: "This blog post does not exist or has been removed.",
    };
  }

  const { content } = post;
  const title = content.title || "Untitled Blog";
  const description =
    content.description || "Read this insightful post on Glyph.";
  const image =
    content.mainImage?.url ||
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/default-og.png`;

  return {
    title: `${title} | Glyph`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return <ErrorPage />;

  return (
    <PostView
      content={post.content}
      creator={post.creator}
      publishedAt={post.publishedAt}
    />
  );
}
