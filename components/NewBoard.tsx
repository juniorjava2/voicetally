import React, { useRef, useState } from 'react'
import { Upload, Link } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface FileUploaderProps {
  onFileSelect: (file: File | string) => void
  acceptedFileTypes: string
}

export function FileUploader({ onFileSelect, acceptedFileTypes }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setFileName(file.name)
    onFileSelect(file)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (url) {
      setFileName(url)
      onFileSelect(url)
    }
  }

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">File Upload</TabsTrigger>
        <TabsTrigger value="url">URL</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <div
          className={`relative p-4 w-full h-32 border-2 border-dashed rounded-lg transition-colors ${
            dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleChange}
          />
          <div className="h-full flex flex-col items-center justify-center text-center">
            {fileName ? (
              <>
                <Upload className="w-8 h-8 text-primary mb-2" />
                <p className="text-sm text-gray-600">{fileName}</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Drag and drop your file here, or</p>
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Select from your computer
                </button>
              </>
            )}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="url">
        <form onSubmit={handleUrlSubmit} className="space-y-2">
          <Input
            type="url"
            placeholder="Enter file URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button type="submit" className="w-full">Submit URL</Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}