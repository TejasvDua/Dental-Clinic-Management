export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[\+]?[1-9][\d]{0,15}$/;
  return regex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateDate = (date) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime()) && parsedDate <= new Date();
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validatePatientForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.fullName)) {
    errors.fullName = 'Full name is required';
  }

  if (!validateRequired(formData.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth is required';
  } else if (!validateDate(formData.dateOfBirth)) {
    errors.dateOfBirth = 'Please enter a valid date';
  }

  if (!validateRequired(formData.contactNumber)) {
    errors.contactNumber = 'Contact number is required';
  } else if (!validatePhone(formData.contactNumber)) {
    errors.contactNumber = 'Please enter a valid phone number';
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateIncidentForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.title)) {
    errors.title = 'Title is required';
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'Description is required';
  }

  if (!validateRequired(formData.appointmentDate)) {
    errors.appointmentDate = 'Appointment date is required';
  }

  if (formData.status === 'completed') {
    if (!validateRequired(formData.cost)) {
      errors.cost = 'Cost is required for completed treatments';
    }
    if (!validateRequired(formData.treatmentDetails)) {
      errors.treatmentDetails = 'Treatment details are required for completed treatments';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};