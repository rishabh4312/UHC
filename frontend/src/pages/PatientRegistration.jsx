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
    <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">New patient registration</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Patient Registration</h1>
          <p className="mt-3 text-sm text-slate-600 max-w-2xl">Register new patients and preserve their details for OPD visits, prescriptions, and lab reports.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="full_name">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
          className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-white text-sm font-semibold shadow-lg transition hover:bg-blue-700"
        >
          Register Patient
        </button>
      </form>
    </div>
    <aside className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Why register patients?</p>
        <p className="mt-3 text-sm text-slate-500">Patient registration keeps medical history consistent and makes OPD visits easier to manage.</p>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Registration checklist</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-500">
          <li>• Confirm patient name and contact details.</li>
          <li>• Add age and gender for record accuracy.</li>
          <li>• Include address for follow-up and communication.</li>
        </ul>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-blue-600 p-5 text-white shadow-lg">
        <p className="text-sm uppercase tracking-[0.18em] text-blue-100">Tip</p>
        <p className="mt-3 text-sm font-semibold">Complete the address details now to save time during OPD checkout.</p>
      </div>
    </aside>
  </div>
  )
}

export default PatientRegistration
