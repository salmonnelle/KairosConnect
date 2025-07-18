import PremiumSearchPageWrapper from "./premium-page-wrapper";

// Server component that passes searchParams to client component wrapper
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // In Next.js 15, searchParams is a Promise that must be awaited
  const resolvedSearchParams = await searchParams;

  return <PremiumSearchPageWrapper searchParams={resolvedSearchParams} />;
}
