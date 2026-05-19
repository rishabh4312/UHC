import { useState } from 'react'

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    age: '',
    gender: '',
    address: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Patient registration data:', formData)
    // TODO: submit form data to backend
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-semibold mb-6">Patient Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="full_name">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="mobile">
            Mobile
          </label>
          <input
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder="Enter mobile number"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder="Enter address"
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Register Patient
        </button>
      </form>
    </div>
  )
}

export default PatientRegistration
