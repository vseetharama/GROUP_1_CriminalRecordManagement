
// app/register/page.jsx
'use client';
import { useState ,useEffect} from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    policeName: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
         useEffect(() => {
              if (typeof window !== 'undefined' && localStorage.getItem("logged_in")) {
              router.push("/dashboard");
                 }
                       }, [router]);

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
    if (!formData.policeName.trim()) formErrors.policeName = 'Police Name is required';
    if (!formData.password) formErrors.password = 'Password is required';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      console.log('Sending login data:', formData); // Debug log
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          policeName: formData.policeName,
          password: formData.password,
        }),
      });

      // Check content type
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        setServerError('Unexpected server response. Please try again.');
        return;
      }

      const data = await res.json();
      console.log('Server response:', data); // Debug log

      if (res.ok) {
        setSuccess('Login successful! Redirecting to dashboard...');
        setFormData({
          policeName: '',
          password: '',
        });
        localStorage.setItem("logged_in", true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setServerError(data.error || 'Something went wrong!');
        console.error('Server error:', data.error); // Debug log
      }
    } catch (error) {
      console.error('Fetch error:', error); // Debug log
      setServerError('Failed to login. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-blue-200 to-blue-700">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Police Login</h2>

        {success && <p className="text-green-600 text-left mb-4">{success}</p>}
        {serverError && <p className="text-red-600 text-left mb-4">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>
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

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#70afae] to-[#c27394] text-white font-semibold text-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-700">
          <a href="/" className="text-blue-600 hover:underline font-semibold">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}