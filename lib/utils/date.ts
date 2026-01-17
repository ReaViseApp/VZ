/**
 * Format a date to a localized string
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  
  return dateObj.toLocaleDateString('en-US', options || defaultOptions)
}

/**
 * Get the current year
 * @returns Current year as a number
 */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}
