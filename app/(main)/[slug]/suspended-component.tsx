export default async function SuspendedComponent({
  slug,
}: {
  slug: Promise<string>;
}) {
  const s = await slug;
  return (
    <div>
      <h1>{s}</h1>
    </div>
  );
}
