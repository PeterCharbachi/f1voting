export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-background-light/50 rounded ${className}`}></div>
  );
};
