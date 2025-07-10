const statsData = [
  {
    value: "95%",
    description: "Coverage for Indians",
  },
  {
    value: "~0.5",
    description: "Seconds - Speed to Verification",
  },
  {
    value: "~3",
    description: "Seconds Same speed as phone OTP",
  },
  {
    value: "#1",
    description: "OTP based solution in India",
  },
]

export default function StatsBanner() {
  return (
    <section className="w-[80%] mx-auto rounded-[2rem] bg-gradient-to-r from-blue-500 to-blue-600 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="text-4xl lg:text-5xl font-bold text-green-400 mb-2">{stat.value}</div>
              <p className="text-sm lg:text-base text-blue-100 leading-tight">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
