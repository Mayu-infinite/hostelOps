import Link from "next/link"

export default function Home(){

  return(

    <div className="flex flex-col items-center justify-center h-screen">

      <h1 className="text-3xl font-bold">
        Hostel Issue Management System
      </h1>

      <Link
        href="/login"
        className="mt-6 bg-blue-500 text-white p-3"
      >
        Login
      </Link>

    </div>

  )

}