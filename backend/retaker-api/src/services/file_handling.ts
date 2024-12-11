export function generateUniqueFilename(originalName: string | undefined): string {
  // Secure filename generation
  return originalName
    ? `${new Date().getTime()}_${originalName}`
    : `${new Date().getTime()}_default`
}
