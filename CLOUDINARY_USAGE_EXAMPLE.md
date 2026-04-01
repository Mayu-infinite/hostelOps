# CloudinaryUpload Component Integration Example

This example shows how to use the CloudinaryUpload component in the complaints form.

## Basic Usage

```jsx
'use client'

import { useState } from 'react'
import CloudinaryUpload from '@/components/CloudinaryUpload'

export default function ComplaintsForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    image_url: "",  // Store the Cloudinary URL
  })

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({ 
      ...prev, 
      image_url: imageUrl 
    }))
  }

  const handleImageError = (error) => {
    console.error('Upload error:', error)
    // Show toast or alert to user
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // formData.image_url now contains the Cloudinary secure_url
    // Send to backend as usual
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      ...(formData.image_url && { image_url: formData.image_url })
    }
    
    await api.post("/api/v1/complaints", payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        placeholder="Complaint title"
      />

      {/* Description */}
      <textarea
        name="description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        placeholder="Complaint description"
      />

      {/* Category Selection */}
      <select
        name="category"
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
      >
        <option value="plumbing">Plumbing</option>
        <option value="electrical">Electrical</option>
        <option value="other">Other</option>
      </select>

      {/* Cloudinary Upload Component */}
      <CloudinaryUpload
        onUpload={handleImageUpload}
        onError={handleImageError}
        className="mt-6"
      />

      {/* Submit */}
      <button type="submit">Submit Complaint</button>
    </form>
  )
}
```

## Component Props

| Prop | Type | Description |
|------|------|-------------|
| `onUpload` | `(url: string) => void` | Called when upload succeeds with Cloudinary secure URL |
| `onError` | `(error: string) => void` | Called when upload fails or signature generation fails |
| `className` | `string` | Additional CSS classes to apply to the container |

## What Happens Behind the Scenes

1. **User clicks "Choose Image"**
   - CldUploadWidget opens file picker

2. **User selects an image**
   - Widget calls `handleSignatureEndpoint()`

3. **Frontend requests signature from backend**
   - POST to `/api/v1/upload/generate-upload-signature`
   - Backend verifies user is authenticated
   - Backend returns signed request data

4. **Widget uploads to Cloudinary**
   - Sends image + signature to Cloudinary
   - Cloudinary validates signature
   - Image stored securely in Cloudinary

5. **Upload completes**
   - `onUpload()` called with `secure_url`
   - You save this URL to your form/state
   - Later, send URL to backend when filing complaint

## URL Flow

```
Input Image (local computer)
        ↓
Cloudinary Upload (with backend signature)
        ↓
Cloudinary Stores (your account)
        ↓
Returns: secure_url (HTTPS link)
        ↓
Your Form (formData.image_url)
        ↓
Backend API (saved in DB)
        ↓
Database (complaints table)
```

## Error Handling

The component handles:
- ✅ Signature generation failures
- ✅ Upload failures
- ✅ Network errors
- ✅ User-friendly error messages

All errors trigger the `onError` callback, which you can use to show toasts or alerts.

## Key Features

- 🔒 **Secure**: Backend signs all uploads, API secret never exposed
- 🎨 **UI**: Shows upload button, preview after success, error messages
- 🚀 **Fast**: Uploads directly to Cloudinary, not your server
- 📱 **Responsive**: Works on mobile and desktop
- ♿ **Accessible**: Proper button states and error messages
