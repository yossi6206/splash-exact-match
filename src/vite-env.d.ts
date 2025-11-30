/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

// Generic type declaration for all image imports with query parameters
declare module '*.jpg?*' {
  const src: string;
  export default src;
}

declare module '*.jpeg?*' {
  const src: string;
  export default src;
}

declare module '*.png?*' {
  const src: string;
  export default src;
}

declare module '*.webp?*' {
  const src: string;
  export default src;
}

declare module '*.avif?*' {
  const src: string;
  export default src;
}

declare module '*.svg?*' {
  const src: string;
  export default src;
}
