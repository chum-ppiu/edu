import { ref } from 'vue'

export function useFormValidation() {
  const errors = ref({})

  /**
   * Evaluates a form dataset against validation boundaries.
   * @param {Object} formData - The raw state values (e.g. studentForm.value)
   * @param {Array<Object>} rules - Rules specifying translation parameters [{ key: 'firstName', i18nKey: 'addStudent.firstName' }]
   */
  const validateForm = (formData, rules) => {
    errors.value = {}

    rules.forEach((rule) => {
      const value = formData[rule.key]
      
      // Check for empty inputs
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        // CRITICAL FIX: Save the raw translation key structural metadata instead of rendered text!
        errors.value[rule.key] = {
          errorType: 'requiredField',
          fieldKey: rule.i18nKey
        }
      }
    })

    return Object.keys(errors.value).length === 0
  }

  const clearError = (key) => {
    if (errors.value[key]) {
      delete errors.value[key]
    }
  }

  return {
    errors,
    validateForm,
    clearError
  }
}