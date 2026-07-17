export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateNIK(nik) {
  return /^\d{16}$/.test(nik);
}

export function validatePhone(phone) {
  return /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone);
}

export function validateRequired(value) {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}

export function validateFileSize(file, maxSizeMB = 5) {
  return file.size <= maxSizeMB * 1024 * 1024;
}

export function validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) {
  return allowedTypes.includes(file.type);
}
