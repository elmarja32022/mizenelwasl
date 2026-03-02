// Check if the app is running in a read-only environment (like Vercel with SQLite)
export const isReadOnlyEnvironment = () => {
  return process.env.VERCEL === '1'
}

// Check if database is writable
export const canWriteToDatabase = async (): Promise<boolean> => {
  if (isReadOnlyEnvironment()) {
    return false
  }
  return true
}
