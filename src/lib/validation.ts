export function validateTitle(title: unknown): string {
    if (typeof title !== 'string') return 'Untitled document'
    const trimmed = title.trim()
    return trimmed.length > 0 ? trimmed.slice(0, 200) : 'Untitled document'
  }
  
  export function validateRole(role: unknown): 'VIEW' | 'EDIT' | null {
    if (role === 'VIEW' || role === 'EDIT') return role
    return null
  }
  
  export function validateEmail(email: unknown): string | null {
    if (typeof email !== 'string') return null
    const trimmed = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(trimmed) ? trimmed : null
  }