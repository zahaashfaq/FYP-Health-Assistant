// src/auth/validationSchemas.js
import * as Yup from 'yup';

/**
 * Basic auth schema — used by Signup form.
 * Validates: name, email, password, confirmPassword.
 */
export const basicSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'At least 6 characters')
    .matches(/[A-Z]/, 'At least one uppercase letter')
    .matches(/\d/, 'At least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

/**
 * Login schema — validates email + password only.
 */
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'At least 6 characters')
    .required('Password is required'),
});

/**
 * Forgot password schema.
 */
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

/**
 * Profile setup schema.
 */
export const profileSchema = Yup.object().shape({
  age: Yup.number()
    .min(10, 'Age must be at least 10')
    .max(100, 'Age must be below 100')
    .required('Age is required'),
  gender: Yup.string().required('Gender is required'),
  height: Yup.number()
    .min(50, 'Height must be at least 50 cm')
    .max(300, 'Height must be below 300 cm')
    .required('Height is required'),
  weight: Yup.number()
    .min(20, 'Weight must be at least 20 kg')
    .max(500, 'Weight must be below 500 kg')
    .required('Weight is required'),
  targetWeight: Yup.number()
    .min(20, 'Target weight must be at least 20 kg')
    .max(500, 'Target weight must be below 500 kg')
    .required('Target weight is required'),
});

export default basicSchema;