type BannerDividerProps = {
  className?: string;
  fillColor?: string;
};

export const BannerDivider = ({
  className = 'w-full h-12',
  fillColor = '#f9fafb',
}: BannerDividerProps) => {
  return (
    <svg
      className={className}
      style={{ fill: fillColor }}
      viewBox='0 0 1200 120'
      preserveAspectRatio='none'
    >
      <path d='M0,120 C150,100 350,60 600,80 C850,100 1050,120 1200,100 L1200,140 L0,140 Z'></path>
    </svg>
  );
};
