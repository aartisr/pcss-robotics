interface SchoolSealProps {
  size?: 'header' | 'footer';
  className?: string;
}

export function SchoolSeal({ size = 'header', className = '' }: SchoolSealProps) {
  return <img
    src="/images/pcss-ii-school-seal.webp"
    alt="Pioneer Charter School of Science II seal"
    width={size === 'footer' ? 64 : 40}
    height={size === 'footer' ? 64 : 40}
    className={`shrink-0 rounded-full border border-white/20 bg-white object-contain ${className}`}
    loading={size === 'footer' ? 'lazy' : 'eager'}
  />;
}
