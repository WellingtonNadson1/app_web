"use client"
import { Card } from "@/components/ui/card";
import { BASE_URL } from "@/functions/functions";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LessonList } from "./lesson-list";
import { LessonRegistrationForm } from "./lesson-registration-form";
import { columns } from "./table-temas-licoes-celulas/columns";
import { DataTableLicoesCelulas } from "./table-temas-licoes-celulas/data-table-licoes-celulas";
import { ThemeList } from "./theme-list";
import { ThemeRegistrationForm } from "./theme-registration-form";


type Theme = {
  folderName: string
}

type Lesson = {
  id: string
  themeId: string
  title: string
  keyVerse: string
  date: Date
}

export default function LicoesCelula() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth(session?.user.token as string);
  const URLCelulas = `${BASE_URL}/celulas`;

  const getCelulas = async () => {
    const { data } = await axiosAuth.get(URLCelulas);
    return data;
  };

  const {
    data: celulas,
    isLoading,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["allCelulasIbb"],
    queryFn: getCelulas,
  });

  const addTheme = (theme: Theme) => {
    setThemes([...themes, theme])
  }

  const editTheme = (updatedTheme: Theme) => {
    setThemes(themes.map(theme => theme.folderName === updatedTheme.folderName ? updatedTheme : theme))
  }

  const deleteTheme = (themeId: string) => {
    setThemes(themes.filter(theme => theme.folderName !== themeId))
    setLessons(lessons.filter(lesson => lesson.themeId !== themeId))
  }

  const addLesson = (lesson: Lesson) => {
    setLessons([...lessons, lesson])
  }

  const editLesson = (updatedLesson: Lesson) => {
    setLessons(lessons.map(lesson => lesson.id === updatedLesson.id ? updatedLesson : lesson))
  }

  const deleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== lessonId))
  }

  return (
    <>
      <div className="relative w-full px-4 py-2 mx-auto mt-4 ">
        <Card className="w-full px-6 py-6 bg-white rounded-xl mb-3">

          <h1 className="text-2xl font-bold mb-4">Plano dos Temas das Lições de Células</h1>
          <div className="mt-2 card-body">
            {themes.length === 0 ? (
              <ThemeRegistrationForm onSubmitForm={addTheme} />
            ) : (
              <>
                <ThemeList

                  themes={themes}
                  onEdit={editTheme}
                  onDelete={deleteTheme}
                  onSelect={setSelectedTheme}
                />

                {selectedTheme && (
                  <>
                    <h2 className="text-xl font-semibold mt-8 mb-4">
                      Lessons for: {selectedTheme.folderName}
                    </h2>

                    {lessons.filter(lesson => lesson.themeId === selectedTheme.folderName).length < 7 && (
                      <LessonRegistrationForm
                        themeId={selectedTheme.folderName}
                        onSubmit={addLesson}
                      />
                    )}

                    <LessonList
                      lessons={lessons.filter(lesson => lesson.themeId === selectedTheme.folderName)}
                      onEdit={editLesson}
                      onDelete={deleteLesson}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </Card>
        <DataTableLicoesCelulas columns={columns} data={celulas as any} />
      </div>
    </>
  );
}

