"use client"

import { useEffect,useState } from "react"
import api from "@/lib/api"

export default function Admin(){

  const [complaints,setComplaints] = useState([])

  useEffect(()=>{

    api.get("/complaints")
      .then(res=>setComplaints(res.data))

  },[])

  return(

    <div className="p-10">

      <h1 className="text-2xl font-bold">
        Admin Panel
      </h1>

      {complaints.map(c=>(
        <div key={c.id} className="border p-4 mt-4">

          <h2>{c.title}</h2>
          <p>{c.description}</p>

          <button className="bg-green-500 text-white p-2 mt-2">
            Mark Resolved
          </button>

        </div>
      ))}

    </div>

  )

}