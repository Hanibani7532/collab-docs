'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'

export default function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Upload failed')
        return
      }

      router.push(`/docs/${data.document.id}`)
    } catch {
      alert('Failed to upload file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-white/15 text-zinc-200 hover:text-white hover:border-cyan-400/50 text-sm font-semibold transition-all disabled:opacity-50"
      >
        {/* Corner Button Accents */}
        <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />

        <Upload className="w-4 h-4 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
        <span>{uploading ? 'Parsing File...' : 'Import .txt / .md'}</span>
      </button>
    </>
  )
}