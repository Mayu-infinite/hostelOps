'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Upload, X, AlertCircle } from 'lucide-react'

export default function CloudinaryUpload({ onUpload, onError, className = "" }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  const handleUpload = (result) => {
    try {
      console.log("Full result object:", result)
      
      // Handle the success event
      if (result.event === 'success') {
        console.log("Success event detected")
        const imageUrl = result.info.secure_url
        console.log("Upload successful! URL:", imageUrl)
        setPreview(imageUrl)
        setError(null)
        setUploading(false)
        if (onUpload) {
          console.log("Calling onUpload callback with:", imageUrl)
          onUpload(imageUrl)
        }
      }
      
      // Also handle the finish event (some versions use this)
      if (result.event === 'finish') {
        console.log("Finish event detected, info:", result.info)
        const imageUrl = result.info.secure_url
        if (imageUrl) {
          console.log("Upload finished! URL:", imageUrl)
          setPreview(imageUrl)
          setError(null)
          setUploading(false)
          if (onUpload) {
            console.log("Calling onUpload callback with:", imageUrl)
            onUpload(imageUrl)
          }
        }
      }
    } catch (err) {
      console.error("Upload error:", err)
      const errorMsg = err.message || 'Upload failed'
      setError(errorMsg)
      setUploading(false)
      if (onError) {
        onError(errorMsg)
      }
    }
  }



  const clearPreview = () => {
    setPreview(null)
    setError(null)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {preview ? (
        <div className="space-y-3">
          {/* Thumbnail Preview */}
          <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg border-2 border-success">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-success">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold text-success text-sm">✓ Upload Successful!</p>
              <p className="text-xs text-base-content/60">Image ready to be saved</p>
            </div>
            <button
              onClick={clearPreview}
              className="btn btn-ghost btn-sm btn-circle"
              title="Clear and upload a different image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <CldUploadWidget
          cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
          uploadPreset="hostel_ops_unsigned"
          onUpload={handleUpload}
          onSuccess={(result) => {
            console.log("onSuccess callback:", result)
            const imageUrl = result.info?.secure_url
            if (imageUrl) {
              setPreview(imageUrl)
              setError(null)
              setUploading(false)
              if (onUpload) {
                onUpload(imageUrl)
              }
            }
          }}
          onQueuesEnd={() => setUploading(false)}
          onUploadStart={() => setUploading(true)}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={uploading}
              className="btn btn-outline w-full gap-2"
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Choose Image
                </>
              )}
            </button>
          )}
        </CldUploadWidget>
      )}

      {error && (
        <div className="alert alert-error gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="btn btn-ghost btn-sm btn-circle ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
