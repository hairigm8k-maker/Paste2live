export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-block animate-spin rounded-full border-2 border-[#d4e0ed] border-t-[#006bff]"
      aria-label="Loading"
    />
  );
}
