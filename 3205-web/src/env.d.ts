declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string
  }
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}
