/** SECURITY CONSTANTS */
export const SECURITY = {
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PASSWORD_ERROR_MSG:
    "Password must contain an uppercase letter, a lowercase letter, a digit and a special character and must be at least 8 characters long",
};

/** FILE CONSTANTS */
export class FILE {
  static MAX_FILE_SIZE_MB = 2;
  static MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1025 * 1024;
  static MAX_FILE_SIZE_ERR_MSG = `File size must be at most ${this.MAX_FILE_SIZE_MB}MB`;
}

/** ML API CONSTANTS */
export const ML_API = {
  EXPLANATIONS_REG: /__(\w+)\s*/,
};
