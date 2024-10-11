import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { LessonRegistrationForm } from "./lesson-registration-form"

type Lesson = {
  id: string
  themeId: string
  title: string
  keyVerse: string
  date: Date
}

type LessonListProps = {
  lessons: Lesson[]
  onEdit: (lesson: Lesson) => void
  onDelete: (lessonId: string) => void
}

export function LessonList({ lessons, onEdit, onDelete }: LessonListProps) {
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Key Verse:</strong> {lesson.keyVerse}</p>
            <p><strong>Date:</strong> {lesson.date.toLocaleDateString()}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setEditingLesson(lesson)}>
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Lesson</DialogTitle>
                </DialogHeader>
                {editingLesson && (
                  <LessonRegistrationForm
                    themeId={editingLesson.themeId}
                    onSubmit={(updatedLesson) => {
                      onEdit(updatedLesson)
                      setEditingLesson(null)
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={() => onDelete(lesson.id)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
