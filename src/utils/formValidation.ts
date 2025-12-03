import { toast } from "sonner";

// Validation patterns
const LETTERS_ONLY_PATTERN = /^[\u0590-\u05FFa-zA-Z\s\-׳'"״]+$/;
const NUMBERS_ONLY_PATTERN = /^\d*$/;
const PHONE_PATTERN = /^0\d{0,9}$/; // Israeli phone: starts with 0, up to 10 digits
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Field name translations for error messages
const fieldNameTranslations: Record<string, string> = {
  street: "רחוב",
  location: "מיקום",
  seller_name: "שם המוכר",
  company_name: "שם החברה",
  full_name: "שם מלא",
  house_number: "מספר בית",
  seller_phone: "טלפון",
  phone: "טלפון",
  email: "אימייל",
};

type ValidationRule = "letters" | "numbers" | "phone" | "email";

interface FieldValidationConfig {
  [fieldName: string]: ValidationRule;
}

/**
 * Validates a field value based on the specified rule
 * Returns true if valid, false if invalid (and shows toast error)
 */
export const validateField = (
  fieldName: string,
  value: string,
  rule: ValidationRule
): boolean => {
  if (!value) return true; // Empty values are allowed (required validation is separate)

  const displayName = fieldNameTranslations[fieldName] || fieldName;

  if (rule === "letters") {
    if (!LETTERS_ONLY_PATTERN.test(value)) {
      toast.error(`בשדה ${displayName} ניתן להזין רק אותיות`);
      return false;
    }
  }

  if (rule === "numbers") {
    if (!NUMBERS_ONLY_PATTERN.test(value)) {
      toast.error(`בשדה ${displayName} ניתן להזין רק מספרים`);
      return false;
    }
  }

  if (rule === "phone") {
    // Allow only digits and must start with 0
    if (!PHONE_PATTERN.test(value)) {
      toast.error("מספר טלפון חייב להכיל רק ספרות ולהתחיל ב-0");
      return false;
    }
    // Check max length (10 digits for Israeli mobile)
    if (value.length > 10) {
      toast.error("מספר טלפון יכול להכיל עד 10 ספרות");
      return false;
    }
  }

  if (rule === "email") {
    // Only validate format if there's a complete-looking email
    if (value.includes("@") && !EMAIL_PATTERN.test(value)) {
      toast.error("כתובת אימייל לא תקינה");
      return false;
    }
  }

  return true;
};

/**
 * Creates a validated input change handler
 * @param setFormData - The state setter function
 * @param formData - Current form data
 * @param validationConfig - Configuration object mapping field names to validation rules
 */
export const createValidatedChangeHandler = <T extends Record<string, any>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  formData: T,
  validationConfig: FieldValidationConfig
) => {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Check if this field has a validation rule
    const rule = validationConfig[name];
    if (rule) {
      const isValid = validateField(name, value, rule);
      if (!isValid) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };
};

// Pre-configured validation configs for common form types
export const propertyValidationConfig: FieldValidationConfig = {
  street: "letters",
  location: "letters",
  seller_name: "letters",
  house_number: "numbers",
  seller_phone: "phone",
};

export const carValidationConfig: FieldValidationConfig = {
  location: "letters",
  seller_name: "letters",
  seller_phone: "phone",
};

export const laptopValidationConfig: FieldValidationConfig = {
  location: "letters",
  seller_name: "letters",
  seller_phone: "phone",
};

export const secondhandValidationConfig: FieldValidationConfig = {
  location: "letters",
  seller_name: "letters",
  seller_phone: "phone",
};

export const jobValidationConfig: FieldValidationConfig = {
  location: "letters",
  company_name: "letters",
};

export const freelancerValidationConfig: FieldValidationConfig = {
  full_name: "letters",
};

export const businessValidationConfig: FieldValidationConfig = {
  location: "letters",
  seller_name: "letters",
  seller_phone: "phone",
};
