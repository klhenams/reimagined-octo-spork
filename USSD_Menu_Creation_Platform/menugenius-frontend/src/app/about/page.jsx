import Image from "next/image"
import Navbar from "../ui/homepage/navbar"
import Link from "next/link"

export default function MenugeniusDocumentation() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center px-4 sm:px-6 py-28 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <header className="mb-12 sm:mb-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 mt-4 sm:mb-6">
            About MenuGenius
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto">
            Empower your business with powerful USSD menus - no coding required.
          </p>
        </header>

        <section className="mb-12 sm:mb-24 max-w-5xl w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
            What is MenuGenius?
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              MenuGenius is an innovative USSD generation platform designed to empower businesses and individuals. Create dynamic, accessible USSD apps that work anywhere - no internet required. Our intuitive tools make it easy to build powerful mobile experiences that reach every customer, revolutionizing how you connect with your audience.
            </p>
          </div>
        </section>

        <section className="mb-12 sm:mb-24 max-w-6xl w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-12 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              title="Rapid Menu Creation"
              description="Design and deploy USSD menus with unparalleled speed and simplicity using our intuitive interface and extensive template library."
              icon="🚀"
            />
            <FeatureCard
              title="Intuitive Flow Creation"
              description="Map user journeys with precision using our visual flow designer. Create dynamic, adaptive menus that respond to user inputs and integrate with external systems."
              icon="🔀"
            />
            <FeatureCard
              title="Customer Management"
              description="Gain valuable insights with powerful analytics. Build user profiles, segment your audience, and optimize engagement through A/B testing."
              icon="📊"
            />
          </div>
        </section>

        <section className="mb-12 sm:mb-24 max-w-5xl w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-12 text-center">
            How To Create a USSD Flow
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <ol className="list-decimal list-inside space-y-3 sm:space-y-4 text-base sm:text-xl text-gray-700">
              <li>Sign up for a MenuGenius account and log in to the dashboard.</li>
              <li>Click &quot;Create New Flow&quot; and choose a template or start from scratch.</li>
              <li>Use our intuitive interface to add menu items and define their actions.</li>
              <li>Preview your flow in real-time and test it thoroughly.</li>
              <li>Configure integration with your existing systems or APIs.</li>
              <li>Assign a shortcode to your flow (or use our shared shortcode service).</li>
              <li>Publish your flow and start engaging with customers!</li>
            </ol>
          </div>
        </section>

        <section className="mb-12 sm:mb-24 max-w-6xl w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 sm:mb-12 text-center">
            Use Cases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <UseCaseCard
              title="Customer Surveys"
              description="Collect valuable feedback and insights from your customers through easy-to-use USSD surveys."
              icon="📝"
            />
            <UseCaseCard
              title="Event Registration"
              description="Streamline event sign-ups with a simple USSD flow, making it accessible to all mobile users."
              icon="🎫"
            />
            <UseCaseCard
              title="Food Ordering"
              description="Enable customers to browse menus and place orders via USSD, expanding your reach beyond smartphone apps."
              icon="🍔"
            />
            <UseCaseCard
              title="Appointment Booking"
              description="Allow clients to schedule appointments effortlessly, reducing no-shows and improving service efficiency."
              icon="📅"
            />
            <UseCaseCard
              title="Banking Services"
              description="Provide essential banking functions like balance inquiries and transfers through secure USSD menus."
              icon="🏦"
            />
            <UseCaseCard
              title="Information Services"
              description="Deliver news updates, weather forecasts, or educational content directly to users' mobile phones."
              icon="ℹ️"
            />
          </div>
        </section>

        <section className="max-w-4xl w-full text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
            Ready to get started?
          </h2>
          <Link
          href="/auth/signup"
          >

          <button className="bg-indigo-600 text-white text-lg sm:text-xl font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full hover:bg-indigo-700 transition duration-300 w-full sm:w-auto">
            Try MenuGenius for Free
          </button>
          </Link>

        </section>
      </div>
    </>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
      <div className="text-3xl sm:text-4xl mb-4">{icon}</div>
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">{title}</h3>
      <p className="text-gray-700 text-sm sm:text-base">{description}</p>
    </div>
  )
}

function UseCaseCard({ title, description, icon }) {
  return (
    <div className="bg-gray-50 p-5 sm:p-6 rounded-xl transition duration-300 hover:bg-white hover:shadow-lg">
      <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-700 text-sm sm:text-base">{description}</p>
    </div>
  )
}