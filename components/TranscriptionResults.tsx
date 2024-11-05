'use client'

import { useState, useEffect } from 'react'
import { Edit2, Save, Download, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { jsPDF } from 'jspdf'

interface TranscriptionData {
  id: string
  fileName: string
  language: string
  transcript: string
  date: string
}

export default function TranscriptionResults() {
  const [transcriptions, setTranscriptions] = useState<TranscriptionData[]>([])
  const [selectedTranscription, setSelectedTranscription] = useState<TranscriptionData | null>(null)
  const [editedTranscript, setEditedTranscript] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const storedTranscriptions = JSON.parse(localStorage.getItem('transcriptions') || '[]')
    setTranscriptions(storedTranscriptions)
    if (storedTranscriptions.length > 0) {
      setSelectedTranscription(storedTranscriptions[0])
      setEditedTranscript(storedTranscriptions[0].transcript)
    }
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (selectedTranscription) {
      const updatedTranscription = { ...selectedTranscription, transcript: editedTranscript }
      setSelectedTranscription(updatedTranscription)
      const updatedTranscriptions = transcriptions.map(t => t.id === updatedTranscription.id ? updatedTranscription : t)
      setTranscriptions(updatedTranscriptions)
      localStorage.setItem('transcriptions', JSON.stringify(updatedTranscriptions))
      setIsEditing(false)
    }
  }

  const handleDownload = (format: 'pdf' | 'txt') => {
    if (selectedTranscription) {
      const content = selectedTranscription.transcript
      const fileName = `${selectedTranscription.fileName}_transcript.${format}`
      
      if (format === 'txt') {
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)
      } else {
        const pdf = new  jsPDF()
        pdf.text(content, 10, 10)
        pdf.save(fileName)
      }
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Transcription History</h2>
          {transcriptions.map((item) => (
            <div
              key={item.id}
              className="mb-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => {
                setSelectedTranscription(item)
                setEditedTranscript(item.transcript)
                setIsEditing(false)
              }}
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">{item.fileName}</span>
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Clock className="mr-1 h-3 w-3" />
                <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedTranscription && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedTranscription.fileName} - {selectedTranscription.language}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end space-x-2">
                {!isEditing && (
                  <Button onClick={handleEdit} variant="outline">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
                {isEditing && (
                  <Button onClick={handleSave} variant="outline">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                )}
                <Button onClick={() => handleDownload('txt')} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download TXT
                </Button>
                <Button onClick={() => handleDownload('pdf')} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedTranscript}
                  onChange={(e) => setEditedTranscript(e.target.value)}
                  className="w-full h-[calc(100vh-300px)] p-4 border rounded"
                />
              ) : (
                <div className="w-full h-[calc(100vh-300px)] p-4 border rounded overflow-y-auto whitespace-pre-wrap">
                  {selectedTranscription.transcript}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}