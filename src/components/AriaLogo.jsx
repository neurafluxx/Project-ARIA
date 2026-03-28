export function AriaLogo({ size = 32, height, width, className = '', style = {} }) {
  // Use the uploaded png logo from the public directory
  const actualHeight = height || size;
  const actualWidth = width || 'auto';
  return (
    <img
      src="/compact-dark-logo.png"
      alt="Aria Logo"
      className={className}
      style={{
        height: actualHeight,
        width: actualWidth,
        objectFit: 'contain',
        display: 'block',
        ...style
      }}
    />
  );
}
