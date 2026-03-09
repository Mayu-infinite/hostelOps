export default function Dashboard(){

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="mt-6 space-y-3">

        <a href="/complaints" className="block text-blue-500">
          View Complaints
        </a>

        <a href="/admin" className="block text-blue-500">
          Admin Panel
        </a>

      </div>

    </div>

  )

}