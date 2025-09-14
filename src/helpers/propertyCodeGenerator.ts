/**
 * Generates a property code based on the property name
 * @param name - The property name
 * @returns A generated property code
 */
export function generatePropertyCode(name: string): string {
  if (!name || name.trim().length === 0) {
    return ''
  }

  // Remove special characters and normalize Vietnamese text
  const normalizedName = name
    .toLowerCase()
    .trim()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[đ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()

  // Split into words and take first letters
  const words = normalizedName.split(' ')
  if (words.length === 0) {
    return ''
  }

  // If single word, take first 3-4 characters
  if (words.length === 1) {
    const word = words[0]
    if (word.length <= 3) {
      return word.toUpperCase()
    }
    return word.substring(0, 4).toUpperCase()
  }

  // If multiple words, take first letter of each word (max 3 words)
  const initials = words
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()

  return initials
}

/**
 * Generates a unique property code with a number suffix
 * @param name - The property name
 * @param existingCodes - Array of existing property codes to avoid duplicates
 * @returns A unique property code
 */
export function generateUniquePropertyCode(name: string, existingCodes: string[] = []): string {
  const baseCode = generatePropertyCode(name)
  if (!baseCode) {
    return ''
  }

  // Check if base code is unique
  if (!existingCodes.includes(baseCode)) {
    return baseCode
  }

  // Add number suffix to make it unique
  let counter = 1
  let uniqueCode = `${baseCode}${counter.toString().padStart(2, '0')}`

  while (existingCodes.includes(uniqueCode)) {
    counter++
    uniqueCode = `${baseCode}${counter.toString().padStart(2, '0')}`
  }

  return uniqueCode
}

/**
 * Examples of generated codes:
 * "Chung cư Sunrise" -> "CCS"
 * "Nhà trọ ABC" -> "NTA"
 * "Ký túc xá sinh viên" -> "KTS"
 * "Tòa nhà City Center" -> "TNC"
 * "Apartment Complex" -> "AC"
 */
