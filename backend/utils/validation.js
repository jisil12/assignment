const validateName = (name) => {
  if (!name || name.length < 20 || name.length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return null;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters';
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }
  
  return null;
};

const validateAddress = (address) => {
  if (!address || address.length > 400) {
    return 'Address must not exceed 400 characters';
  }
  return null;
};

const validateRating = (rating) => {
  const numRating = parseInt(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return 'Rating must be between 1 and 5';
  }
  return null;
};

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  validateRating
};