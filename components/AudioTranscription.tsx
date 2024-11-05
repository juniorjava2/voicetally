'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { transcribeAudio } from '@/app/action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { FileUploader } from './FileUploader'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Transcribing...
        </>
      ) : (
        'Transcribe'
      )}
    </Button>
  )
}

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Kiswahili', label: 'Kiswahili' },
  { value: 'French', label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
]

export default function AudioTranscription() {
  const [error, setError] = useState<string>('')
  const [language, setLanguage] = useState('English')
  const [detectLanguage, setDetectLanguage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  async function handleSubmit(formData: FormData) {
    if (!selectedFile) {
      setError('Please select an audio file')
      return
    }
    formData.append('audio', selectedFile)
    formData.append('language', language)
    formData.append('detectLanguage', detectLanguage.toString())
    const result = await transcribeAudio(formData)
    if ('transcript' in result) {
      // Save the transcription result to local storage or your preferred storage method
      const transcriptionData = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        language: result.detectedLanguage || language,
        transcript: result.transcript,
        date: new Date().toISOString(),
      }
      const existingTranscriptions = JSON.parse(localStorage.getItem('transcriptions') || '[]')
      localStorage.setItem('transcriptions', JSON.stringify([...existingTranscriptions, transcriptionData]))
      
      // Redirect to the results page
      router.push('/results')
    } else {
        setError(result.error ?? 'An unknown error occurred')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Audio Transcription</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="audio">Audio File</Label>
            <FileUploader onFileSelect={handleFileSelect} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="detect-language"
              checked={detectLanguage}
              onCheckedChange={setDetectLanguage}
            />
            <Label htmlFor="detect-language">Auto-detect language</Label>
          </div>
          {!detectLanguage && (
            <div className="space-y-2">
              <Label htmlFor="language">Transcription Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <SubmitButton />
        </form>
        {error && (
          <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}