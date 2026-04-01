"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import CloudinaryUpload from "@/components/CloudinaryUpload"
import {
  ArrowLeft,
  Plus,
  Loader2,
  AlertCircle,
  Wrench,
  Zap,
  Brush,
  Network,
} from "lucide-react"

const CATEGORIES = [
  { value: "plumbing", label: "Plumbing", icon: Wrench, description: "Water, pipes, taps" },
  { value: "electrical", label: "Electrical", icon: Zap, description: "Lights, switches, power" },
  { value: "cleanliness", label: "Cleanliness", icon: Brush, description: "Cleaning, maintenance" },
  { value: "network", label: "Network", icon: Network, description: "WiFi, connectivity" },
  { value: "furniture", label: "Furniture", icon: AlertCircle, description: "Beds, tables, chairs" },
  { value: "other", label: "Other", icon: AlertCircle, description: "Everything else" },
]

export default function NewComplaintPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    image_url: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (formData.title.trim().length < 3) {
        addToast("Title must be at least 3 characters", "error")
        setLoading(false)
        return
      }

      if (formData.description.trim().length < 10) {
        addToast("Description must be at least 10 characters", "error")
        setLoading(false)
        return
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        ...(formData.image_url && { image_url: formData.image_url })
      }

      const res = await api.post("/api/v1/complaints", payload)
      addToast("✓ Complaint filed successfully!", "success")
      
      // Redirect to complaint detail page after 1.5s
      setTimeout(() => {
        router.push(`/complaints/${res.data.id}`)
      }, 1500)
    } catch (err) {
      addToast(err.response?.data?.detail || "Failed to file complaint", "error")
    } finally {
      setLoading(false)
    }
  }

  const addToast = (message, type) => {
    const id = Date.now()
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  return (
    <div className="bg-base-100 p-4 md:p-6 lg:p-10">
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <div key={toast.id} className={`alert alert-${toast.type === 'error' ? 'error' : 'success'} shadow-lg`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/complaints" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">File New Complaint</h1>
            <p className="text-base-content/60 mt-1">Get help with any hostel issue</p>
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="card bg-base-200 shadow-lg">
          <div className="card-body space-y-6">
            
            {/* Title Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg">Issue Title</span>
                <span className="label-text-alt text-xs text-base-content/60">
                  {formData.title.length}/256
                </span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Brief summary of the issue"
                className="input input-bordered input-lg bg-base-100 focus:input-primary"
                value={formData.title}
                onChange={handleChange}
                maxLength="256"
                required
                autoFocus
              />
              <label className="label">
                <span className="label-text-alt text-xs text-base-content/50">
                  Minimum 3 characters • Maximum 256 characters
                </span>
              </label>
            </div>

            {/* Category Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg">Category</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map(cat => (
                  <label 
                    key={cat.value} 
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                      formData.category === cat.value
                        ? "border-primary bg-primary/10"
                        : "border-base-300 bg-base-100 hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={formData.category === cat.value}
                      onChange={handleChange}
                      className="radio radio-sm"
                    />
                    <div className="ml-2 mt-1">
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" />
                        <span className="font-bold text-sm">{cat.label}</span>
                      </div>
                      <p className="text-xs text-base-content/60 mt-1">{cat.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg">Description</span>
                <span className="label-text-alt text-xs text-base-content/60">
                  {formData.description.length}/5000
                </span>
              </label>
              <textarea
                name="description"
                placeholder="Provide detailed information about the issue..."
                className="textarea textarea-bordered textarea-lg bg-base-100 focus:textarea-primary"
                value={formData.description}
                onChange={handleChange}
                maxLength="5000"
                rows="6"
                required
              />
              <label className="label">
                <span className="label-text-alt text-xs text-base-content/50">
                  Minimum 10 characters • Maximum 5000 characters
                </span>
              </label>
            </div>

            {/* Image Upload Field (Optional) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-lg">Attach Photo (Optional)</span>
                <span className="badge badge-sm badge-outline">Optional</span>
              </label>
              <CloudinaryUpload
                onUpload={(imageUrl) => {
                  setFormData(prev => ({ ...prev, image_url: imageUrl }))
                  addToast("✓ Image uploaded successfully!", "success")
                }}
                onError={(error) => {
                  addToast(error, "error")
                }}
                className="mt-2"
              />
              <label className="label">
                <span className="label-text-alt text-xs text-base-content/50">
                  Upload a photo showing the issue (helps us resolve faster!)
                </span>
              </label>
              {formData.image_url && (
                <div className="mt-3 p-3 bg-success/10 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-success">✓ Image ready to upload</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                    className="text-sm text-base-content/60 hover:text-base-content underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="alert bg-base-100 border border-base-300">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h3 className="font-bold">Tips for faster resolution</h3>
                <ul className="text-xs text-base-content/70 mt-1 list-disc list-inside space-y-1">
                  <li>Be specific and clear about the issue</li>
                  <li>Mention your room number if relevant</li>
                  <li>Add photos if possible - they really help!</li>
                  <li>Choose the correct category</li>
                </ul>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg flex-1 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Filing Complaint...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    File Complaint
                  </>
                )}
              </button>
              <Link href="/complaints" className="btn btn-outline btn-lg">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
