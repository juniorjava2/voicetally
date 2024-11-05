import AudioTranscription from '@/components/AudioTranscription'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-primary">Audio Transcription App</h1>
      <AudioTranscription />
    </main>
  )
}