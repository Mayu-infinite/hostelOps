"use client"

import { useEffect,useState } from "react"
import api from "@/lib/api"

export default function Complaints(){

  const [complaints,setComplaints] = useState([])

  useEffect(()=>{

    api.get("/complaints")
      .then(res=>{
        setComplaints(res.data)
      })

  },[])

  return(

    <div className="p-10">

      <h1 className="text-2xl font-bold">
        Complaints
      </h1>

      {complaints.map(c=>(
        <div key={c.id} className="border p-4 mt-4">

          <h2 className="font-bold">{c.title}</h2>
          <p>{c.description}</p>

        </div>
      ))}

    </div>

  )

}