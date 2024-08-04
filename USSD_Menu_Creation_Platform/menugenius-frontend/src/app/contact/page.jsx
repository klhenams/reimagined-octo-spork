'use client'
import { useState } from 'react'
import Navbar from "../ui/homepage/navbar"

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center px-4 sm:px-6 py-28 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <header className="mb-12 sm:mb-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-4 text-gray-900 mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto">
            We&apos;re here to help. Reach out to us with any questions or inquiries.
          </p>
        </header>

        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition duration-300">
                Send Message
              </button>
            </form>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <p className="flex items-center text-gray-600">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  COE, KNUST Kumasi Ghana
                </p>
                <p className="flex items-center text-gray-600">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  +233547896390
                </p>
                <p className="flex items-center text-gray-600">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  contact@menugenius.com
                </p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Hours</h2>
              <ul className="space-y-2 text-gray-600">
                <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                <li>Saturday: 10:00 AM - 4:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}