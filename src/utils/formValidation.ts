import { toast } from "sonner";

// Validation patterns
const LETTERS_ONLY_PATTERN = /^[\u0590-\u05FFa-zA-Z\s\-׳'"״]+$/;
const NUMBERS_ONLY_PATTERN = /^\d*$/;

// Field name translations for error messages
const fieldNameTranslations: Record<string, string> = {
  street: "רחוב",
  location: "מיקום",
  seller_name: "שם המוכר",
  company_name: "שם החברה",
  full_name: "שם מלא",
  house_number: "מספר בית",
};

type ValidationRule = "letters" | "numbers";

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
};

export const carValidationConfig: FieldValidationConfig = {
  location: "letters",
  seller_name: "letters",
};

export const laptopValidationConfig: FieldValidationConfig = {
  location: "letters",
  seller_name: "letters",
};

export const secondhandValidationConfig: FieldValidationConfig = {
  location: "letters",
  seller_name: "letters",
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
};
