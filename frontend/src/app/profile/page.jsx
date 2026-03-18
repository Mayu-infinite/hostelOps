"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import {
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    hostel_name: "",
    room_number: "",
    batch: "",
  })

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/v1/auth/me")
      setUser(res.data)
      setFormData({
        username: res.data.username || "",
        phone: res.data.phone || "",
        hostel_name: res.data.hostel_name || "",
        room_number: res.data.room_number || "",
        batch: res.data.batch || "",
      })
    } catch (err) {
      showNotification("Failed to load profile", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        username: formData.username || undefined,
        phone: formData.phone || undefined,
        hostel_name: formData.hostel_name || undefined,
        room_number: formData.room_number || undefined,
        batch: formData.batch || undefined,
      }

      // Remove undefined values
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key])

      const res = await api.put("/api/v1/auth/me", payload)
      setUser(res.data)
      showNotification("Profile updated successfully!", "success")
    } catch (err) {
      showNotification(err.response?.data?.detail || "Failed to update profile", "error")
    } finally {
      setSaving(false)
    }
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <p className="text-base-content/60">Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
      
      {/* Notification */}
      {notification.show && (
        <div className={`alert alert-${notification.type === 'error' ? 'error' : 'success'}`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">My Profile</h1>
        <p className="text-base-content/60 mt-2">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          {/* User Info Section */}
          <div className="space-y-6 mb-6">
            {/* Avatar & Role */}
            <div className="flex items-center gap-6">
              <div className="avatar placeholder">
                <div className="w-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user?.username}&background=0D8ABC&color=fff&size=96`}
                    alt={user?.username}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.username}</h2>
                <div className="badge badge-primary uppercase mt-2">{user?.role}</div>
              </div>
            </div>

            {/* Read-only Fields */}
            <div className="divider my-4"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </span>
                </label>
                <input
                  type="email"
                  value={user?.email}
                  className="input input-bordered bg-base-100"
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt text-xs text-base-content/50">
                    Email cannot be changed
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Joined
                  </span>
                </label>
                <input
                  type="text"
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  className="input input-bordered bg-base-100"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Editable Form */}
          <div className="divider my-6"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <User className="w-4 h-4" /> Username
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Your username"
                  className="input input-bordered bg-base-100"
                  value={formData.username}
                  onChange={handleChange}
                  minLength="2"
                  maxLength="50"
                />
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  className="input input-bordered bg-base-100"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="15"
                />
              </div>

              {/* Hostel Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Home className="w-4 h-4" /> Hostel Name
                  </span>
                </label>
                <input
                  type="text"
                  name="hostel_name"
                  placeholder="e.g., H1, H2, H3..."
                  className="input input-bordered bg-base-100"
                  value={formData.hostel_name}
                  onChange={handleChange}
                  maxLength="100"
                />
              </div>

              {/* Room Number */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Home className="w-4 h-4" /> Room Number
                  </span>
                </label>
                <input
                  type="text"
                  name="room_number"
                  placeholder="e.g., 101, 202..."
                  className="input input-bordered bg-base-100"
                  value={formData.room_number}
                  onChange={handleChange}
                  maxLength="20"
                />
              </div>

              {/* Batch */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Batch/Year
                  </span>
                </label>
                <input
                  type="text"
                  name="batch"
                  placeholder="e.g., 2024, 2025..."
                  className="input input-bordered bg-base-100"
                  value={formData.batch}
                  onChange={handleChange}
                  maxLength="20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => fetchUser()}
                className="btn btn-outline"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Info Box */}
      <div className="alert bg-base-200 border-base-300">
        <AlertCircle className="w-5 h-5" />
        <div>
          <h3 className="font-bold">Account Security</h3>
          <p className="text-xs text-base-content/70 mt-1">
            Your email and role are fixed for security. To change them, contact the hostel administration.
          </p>
        </div>
      </div>
    </div>
  )
}
