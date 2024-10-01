import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { ThemeRegistrationForm } from "./theme-registration-form"

type Theme = {
  folderName: string
}

type ThemeListProps = {
  themes: Theme[]
  onEdit: (theme: Theme) => void
  onDelete: (themeId: string) => void
  onSelect: (theme: Theme) => void
}

export function ThemeList({ themes, onEdit, onDelete, onSelect }: ThemeListProps) {
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {themes.map((theme) => (
        <Card key={theme.folderName} className="flex flex-col">
          <CardHeader>
            <CardTitle>{theme.folderName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Nome:</strong> {theme.folderName}</p>
          </CardContent>
          <CardFooter className="flex justify-between mt-auto">
            <Button variant="outline" onClick={() => onSelect(theme)}>
              Select
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setEditingTheme(theme)}>
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Theme</DialogTitle>
                </DialogHeader>
                {editingTheme && (
                  <ThemeRegistrationForm
                    onSubmit={(updatedTheme) => {
                      onEdit(updatedTheme)
                      setEditingTheme(null)
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={() => onDelete(theme.folderName)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
