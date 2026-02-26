"use client"

import { useState, useRef } from "react"
import {
  Search,
  Upload,
  FileText,
  Trash2,
  Leaf,
  Globe,
  BookOpen,
  Users,
  Calculator,
  Code,
  Plus,
  FolderOpen,
  StickyNote,
  BookMarked,
} from "lucide-react"
import { subjects } from "@/lib/constants"

const iconMap: Record<string, React.ElementType> = {
  leaf: Leaf,
  globe: Globe,
  "book-open": BookOpen,
  users: Users,
  calculator: Calculator,
  code: Code,
}

interface UploadedFile {
  name: string
  size: string
  type: string
}

// Mock notes & pages data per subject
const subjectStats: Record<number, { notes: number; pages: number }> = {
  1: { notes: 14, pages: 87 },
  2: { notes: 22, pages: 134 },
  3: { notes: 9, pages: 56 },
}

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<Record<number, UploadedFile[]>>({
    1: [
      { name: "chapter-4-biology.pdf", size: "2.4 MB", type: "PDF" },
      { name: "cell-diagram-notes.txt", size: "128 KB", type: "TXT" },
    ],
    2: [
      { name: "ui-principles.pdf", size: "3.1 MB", type: "PDF" },
    ],
    3: [],
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const getBackendSubjectId = (name: string) => {
    switch (name) {
      case "Biology": return "subject1";
      case "Web Design": return "subject2";
      case "Philosophy": return "subject3";
      default: return "subject1";
    }
  }

  // Only show the first 3 subjects
  const displayedSubjects = subjects
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3)

  const activeSubjectId = selectedSubject ?? displayedSubjects[0]?.id

  const uploadToBackend = async (subjectId: number, subjectName: string, files: File[]) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("subject", getBackendSubjectId(subjectName))
      files.forEach((file) => formData.append("files", file))

      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const newFiles = files.map((f) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: f.name.split(".").pop()?.toUpperCase() || "FILE",
      }))

      setUploadedFiles((prev) => ({
        ...prev,
        [subjectId]: [...(prev[subjectId] || []), ...newFiles],
      }))
    } catch (error) {
      console.error("Error uploading to backend:", error)
      alert("Failed to upload file to backend. Is the backend running?")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!activeSubjectId) return
    const activeSubject = displayedSubjects.find(s => s.id === activeSubjectId)
    if (!activeSubject) return

    const files = Array.from(e.dataTransfer.files)
    await uploadToBackend(activeSubjectId, activeSubject.name, files)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeSubjectId) return
    const activeSubject = displayedSubjects.find(s => s.id === activeSubjectId)
    if (!activeSubject) return

    const files = Array.from(e.target.files || [])
    await uploadToBackend(activeSubjectId, activeSubject.name, files)
  }

  const removeFile = (subjectId: number, index: number) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [subjectId]: (prev[subjectId] || []).filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-4 lg:p-6" >
      {/* Header */}
      < div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Subject Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your subjects, upload study materials, and track progress
          </p>
        </div>
        <button className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-green-2 transition-colors hover:bg-green-1/20">
          <Plus className="h-4 w-4" />
          Add Subject
        </button>
      </div >

      {/* Search */}
      < div className="glass flex items-center gap-3 rounded-xl px-4 py-2.5" >
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Search subjects"
        />
      </div >

      {/* Subject Cards — 3 columns, stretched to fill remaining height */}
      < div className="grid min-h-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-3" >
        {
          displayedSubjects.map((subject) => {
            const Icon = iconMap[subject.icon] || BookOpen
            const isSelected = activeSubjectId === subject.id
            const files = uploadedFiles[subject.id] || []
            const stats = subjectStats[subject.id] ?? { notes: 0, pages: 0 }

            return (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`glass group flex flex-col gap-4 rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.01] ${isSelected
                  ? "ring-1 ring-green-1/40 shadow-lg shadow-green-1/10"
                  : ""
                  }`}
              >
                {/* Subject Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: subject.color }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="text-sm font-semibold text-foreground">
                      {subject.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      {subject.files} files uploaded
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">{subject.description}</p>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Progress</span>
                    <span className="text-[10px] font-medium text-green-2">
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${subject.progress}%`,
                        background: `linear-gradient(to right, ${subject.color}, ${subject.color}aa)`,
                      }}
                    />
                  </div>
                </div>

                {/* Stats Row — Notes & Pages */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ backgroundColor: `${subject.color}15` }}
                  >
                    <StickyNote className="h-4 w-4 shrink-0" style={{ color: subject.color }} />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Notes</p>
                      <p className="text-sm font-bold text-foreground">{stats.notes}</p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ backgroundColor: `${subject.color}15` }}
                  >
                    <BookMarked className="h-4 w-4 shrink-0" style={{ color: subject.color }} />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Pages</p>
                      <p className="text-sm font-bold text-foreground">{stats.pages}</p>
                    </div>
                  </div>
                </div>

                {/* Upload Box */}
                <div
                  className="flex flex-1 flex-col gap-3 rounded-xl border border-dashed p-3 transition-colors"
                  style={{ borderColor: `${subject.color}30` }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (activeSubjectId === subject.id) {
                      fileInputRef.current?.click()
                    } else {
                      setSelectedSubject(subject.id)
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setSelectedSubject(subject.id)
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    setSelectedSubject(subject.id)
                    handleDrop(e)
                  }}
                >
                  {/* Drop zone hint */}
                  <div className="flex items-center gap-2">
                    <Upload
                      className="h-4 w-4 shrink-0"
                      style={{ color: subject.color }}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {isUploading && isSelected ? "Uploading..." : "Drop files or click to upload"}
                    </span>
                  </div>

                  {/* File list */}
                  <div className="flex flex-1 flex-col gap-1.5">
                    {files.length === 0 ? (
                      <div className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-muted-foreground">
                        <FolderOpen className="h-5 w-5" />
                        <p className="text-[10px]">No files yet</p>
                      </div>
                    ) : (
                      files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg bg-[rgba(255,255,255,0.04)] px-2 py-1.5"
                        >
                          <FileText
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: subject.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-medium text-foreground">
                              {file.name}
                            </p>
                            <p className="text-[9px] text-muted-foreground">
                              {file.size} · {file.type}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(subject.id, index)
                            }}
                            className="shrink-0 text-muted-foreground transition-colors hover:text-red-400"
                            aria-label={`Remove ${file.name}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </button>
            )
          })
        }
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="File upload input"
      />
    </div>
  )
}
