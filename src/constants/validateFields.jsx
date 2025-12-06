export const validateFields = (itemState, fields) => {
  // 1. Filter for required fields
  const requiredFields = fields.filter((field) => field.isRequired);

  // 2. Check each required field's value in itemState
  for (const field of requiredFields) {
    const value = itemState[field.id];

    // Determine if the value is empty.
    // - For strings/numbers, check if it's null, undefined, or an empty string.
    // - For arrays (like URIs), check if the array is empty after splitting.
    // NOTE: For checkboxes, they default to `false` and should typically not be required unless their requirement means a specific value. Assuming `false` is a valid "filled" state for a checkbox.

    let isEmpty = false;

    if (field.valueType === "array") {
      // Check if array field is empty or only contains empty strings/newlines
      // The value in itemState is already an array from handleChange,
      // but during initialization it might be an empty string, so we check for both.
      if (
        !value ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "string" && value.trim() === "")
      ) {
        isEmpty = true;
      }
    } else if (field.type === "checkbox") {
      // Checkboxes are considered 'filled' if they are present in itemState,
      // which they are by default in your setup. No standard empty check needed here.
    } else {
      // Standard text/number/other fields check
      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
      ) {
        isEmpty = true;
      }
    }

    if (isEmpty) {
      // Return an error message for the first missing required field
      return `The field "${field.labelText}" is required.`;
    }
  }

  // 3. If all required fields have a value, return a success indicator
  return "success";
};
