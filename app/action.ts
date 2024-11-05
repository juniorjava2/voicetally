'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function transcribeAudio(formData: FormData) {
  try {
    const audioFile = formData.get('audio') as File
    const language = formData.get('language') as string
    const detectLanguage = formData.get('detectLanguage') === 'true'

    if (!audioFile) {
      throw new Error('No audio file provided')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    const audioBytes = await audioFile.arrayBuffer()
    const audioData = new Uint8Array(audioBytes)

    let prompt = detectLanguage
      ? 'Detect the language of the audio and transcribe it. Format the response as: "Detected Language: [language]\n\nTranscript: [transcript]"'
      : `Transcribe the following audio in ${language}:`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: audioFile.type,
          data: Buffer.from(audioData).toString('base64'),
        },
      },
    ])

    const response = result.response.text()

    if (detectLanguage) {
      const [detectedLanguage, transcript] = response.split('\n\n')
      return { detectedLanguage: detectedLanguage.replace('Detected Language: ', ''), transcript: transcript.replace('Transcript: ', '') }
    } else {
      return { transcript: response }
    }
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Transcription failed' }
  }
}