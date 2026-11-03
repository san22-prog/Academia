export function validateAuthInput({ mode, name, email, password }) {
  if (mode === 'signup' && !name.trim()) {
    return {
      valid: false,
      title: 'One tiny thing!',
      message: 'Please enter your name to create your Academia account.',
    };
  }

  if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
    return {
      valid: false,
      title: 'Check your email',
      message: 'Please enter a valid email address.',
    };
  }

  if (password.trim().length < 4) {
    return {
      valid: false,
      title: 'Almost there',
      message: 'Enter a password with at least 4 characters for this demo.',
    };
  }

  return { valid: true };
}
