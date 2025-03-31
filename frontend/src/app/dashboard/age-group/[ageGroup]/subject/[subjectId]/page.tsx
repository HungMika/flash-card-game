'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getQuestionsBySubject, deleteQuestion } from '@/services/question';
import { AddQuestionModal } from '@/features/question/add-quest-modal';
import { QuestionCard } from '@/components/QuestionCard';
import { EditQuestionModal } from '@/features/question/edit-quest-modal';
import { useConfirm } from '@/components/use-confirm';
import { Loader } from 'lucide-react';

type Question = {
  _id: string;
  title: string;
  correctAnswer: string;
  wrongAnswer?: string[]; // 👈 Cho phép undefined
};

export default function SubjectPage() {
  const { ageGroup, subjectId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'This action cannot be undone',
  );

  useEffect(() => {
    if (!subjectId) return;

    async function fetchQuestions() {
      setLoading(true);
      try {
        const data = await getQuestionsBySubject(subjectId as string);
        setQuestions(data ?? []);
        console.log('GET questions:', data);
      } catch (error) {
        console.error('Error on GET questions:', error);
        setQuestions([]);
      }
      setLoading(false);
    }

    fetchQuestions();
  }, [subjectId]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm();
    if (!confirmed) return;

    await deleteQuestion(id);
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };
  if (loading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <>
      <ConfirmDialog />
      <div className="flex flex-col items-center min-h-screen p-4 w-full max-w-screen-lg mx-auto">
        <div className="w-full max-h-[600px] overflow-hidden border p-4 rounded-lg">
          <div className="overflow-y-auto max-h-[500px] scrollbar-hide">
            {questions.length === 0 ? (
              <p className="text-center text-muted-foreground mb-4">
                No questions found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
                {questions.map((q) => (
                  <QuestionCard
                    key={q._id}
                    question={{ ...q, wrongAnswer: q.wrongAnswer ?? [] }}
                    onEdit={(question) => setEditingQuestion(question)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <AddQuestionModal
            subjectId={subjectId as string}
            onQuestionAdded={() =>
              getQuestionsBySubject(subjectId as string).then(setQuestions)
            }
          />
        </div>

        {editingQuestion && (
          <EditQuestionModal
            question={{
              ...editingQuestion,
              wrongAnswer: editingQuestion.wrongAnswer ?? [],
            }}
            subjectId={subjectId as string}
            onClose={() => setEditingQuestion(null)}
            onQuestionUpdated={() =>
              getQuestionsBySubject(subjectId as string).then(setQuestions)
            }
          />
        )}
      </div>
    </>
  );
}
