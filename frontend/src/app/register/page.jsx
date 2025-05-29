const handleSubmit = async (e) => {
  e.preventDefault()
  let formErrors = {}

  // Client-side validation
  if (!formData.policeId.trim()) formErrors.policeId = 'Police ID is required'
  if (!formData.policeName.trim()) formErrors.policeName = 'Police Name is required'
  if (!formData.department.trim()) formErrors.department = 'Department is required'
  if (!formData.policeAddress.trim()) formErrors.policeAddress = 'Police Address is required'
  if (!formData.designation.trim()) formErrors.designation = 'Designation is required'
  if (!formData.password) formErrors.password = 'Password is required'
  if (formData.password !== formData.confirmPassword)
    formErrors.confirmPassword = 'Passwords do not match'

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors)
    return
  }

  try {
    console.log('Sending registration data:', formData)
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
    })

    // Check content type
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text()
      console.error('Non-JSON response:', text)
      setServerError('Unexpected server response. Please try again.')
      return
    }

    const data = await res.json()
    console.log('Server response:', data)

    if (res.ok) {
      setSuccess('Registration successful! Redirecting to login...')
      setFormData({
        policeId: '',
        policeName: '',
        department: '',
        policeAddress: '',
        designation: '',
        password: '',
        confirmPassword: '',
      })
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      setServerError(data.error || 'Something went wrong!')
      console.error('Server error:', data.error)
    }
  } catch (error) {
    console.error('Fetch error:', error)
    setServerError('Failed to register. Please try again later.')
  }
}