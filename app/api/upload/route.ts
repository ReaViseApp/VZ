import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const extension = file.type.split('/')[1] === 'quicktime' ? 'mov' : file.type.split('/')[1]
    const filename = `${randomUUID()}.${extension}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    await mkdir(uploadDir, { recursive: true })
    
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    const url = `/uploads/${filename}`
    
    return NextResponse.json({ url }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
