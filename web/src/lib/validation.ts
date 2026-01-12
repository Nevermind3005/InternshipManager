/**
 * Shared validation patterns and utilities
 */

// Phone number: optional + prefix, 7-19 digits
export const phoneRegex = /^\+?[0-9]{7,19}$/;

// Password: min 8 chars, at least one uppercase, lowercase, number, and special character
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/;

// Student email: name.surname@student.ukf.sk format
export const studentEmailRegex = /^[a-zá-ž]+\.[a-zá-ž]+(\d+)?@student\.ukf\.sk$/;
