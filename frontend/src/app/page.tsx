// app/register/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    policeId: '',
    policeName: '',
    department: '',
    policeAddress: '',
    designation: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSuccess('');
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    // Client-side validation
    if (!formData.policeId.trim()) formErrors.policeId = 'Police ID is required';
    if (!formData.policeName.trim()) formErrors.policeName = 'Police Name is required';
    if (!formData.department.trim()) formErrors.department = 'Department is required';
    if (!formData.policeAddress.trim()) formErrors.policeAddress = 'Police Address is required';
    if (!formData.designation.trim()) formErrors.designation = 'Designation is required';
    if (!formData.password) formErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword)
      formErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policeId: formData.policeId,
          policeName: formData.policeName,
          department: formData.department,
          policeAddress: formData.policeAddress,
          designation: formData.designation,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        setFormData({
          policeId: '',
          policeName: '',
          department: '',
          policeAddress: '',
          designation: '',
          password: '',
          confirmPassword: '',
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setServerError(data.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      setServerError('Failed to register. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-200 to-blue-700">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Police Registration</h2>

        {success && <p className="text-green-600 text-left mb-4">{success}</p>}
        {serverError && <p className="text-red-600 text-left mb-4">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Police ID</label>
            <input
              type="text"
              name="policeId"
              value={formData.policeId}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.policeId ? 'border-red-500 bg-red-100' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all`}
              placeholder="Enter Police ID"
            />
            {errors.policeId && <p className="text-red-500 text-sm mt-1">{errors.policeId}</p>}
          </div>

          <div className="mb-4 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Police Name</label>
            <input
              type="text"
              name="policeName"
              value={formData.policeName}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.policeName ? 'border-red-500 bg-red-100' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all`}
              placeholder="Enter Police Name"
            />
            {errors.policeName && <p className="text-red-500 text-sm mt-1">{errors.policeName}</p>}
          </div>

          <div className="mb-4 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.department ? 'border-red-500 bg-red-100' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all`}
              placeholder="Enter Department"
            />
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>

          <div className="mb-4 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Police Address</label>
            <input
              type="text"
              name="policeAddress"
              value={formData.policeAddress}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.policeAddress ? 'border-red-500 bg-red-100' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all`}
              placeholder="Enter Police Address"
            />
            {errors.policeAddress && <p className="text-red-500 text-sm mt-1">{errors.policeAddress}</p>}
          </div>

          <div className="mb-4 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.designation ? 'border-red-500 bg-red-100' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all`}
              placeholder="Enter Designation"
            />
            {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation}</p>}
          </div>

          <div className="mb-4 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.password ? 'border-red-500 bg-red-100' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all`}
              placeholder="Enter Password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-6 text-left">
            <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg border ${
                errors.confirmPassword ? 'border-red-500 bg-red-100' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all`}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#70afae] to-[#c27394] text-white font-semibold text-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-gray-700">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}