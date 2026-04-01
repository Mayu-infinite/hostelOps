# Cloudinary Setup Guide

## 1. Get Your Cloudinary Credentials

1. Go to https://cloudinary.com
2. Sign up for a free account
3. Navigate to Dashboard
4. Copy your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (keep this secret!)

## 2. Backend Setup (.env)

Add to `backend/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 3. Frontend Setup (.env.local)

Add to `frontend/.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Note: Cloud name is public (prefixed with NEXT_PUBLIC_), but API Keys stay in backend only.

## 4. Install Dependencies

Backend:
```bash
cd backend
pip install -r requirements.txt
```

Frontend:
```bash
cd frontend
npm install  # next-cloudinary should already be installed
```

## 5. Test the Setup

1. Start backend:
```bash
cd backend
uvicorn app.main:app --reload
```

2. Start frontend:
```bash
cd frontend
npm run dev
```

3. Try uploading an image in the complaints form

## 📁 API Endpoint

The backend provides:
- **POST** `/api/v1/upload/generate-upload-signature` - Get an upload signature from the backend
  - Returns: `{ timestamp, signature, api_key, cloud_name }`

## 🔒 Security Note

- Frontend never sees API Secret
- Backend signs all uploads
- Images stored in Cloudinary (not your server)
- URLs saved in database
- Only authenticated users can upload
