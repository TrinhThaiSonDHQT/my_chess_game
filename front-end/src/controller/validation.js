export const isValiPass = (password) => {
  if (password.length < 6) return false;
  return true;
};

export const doubleCheckPass = (password, rePassword) => {
  if (password === rePassword) return true;
  return false;
};
