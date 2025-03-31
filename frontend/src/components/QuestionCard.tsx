import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Question {
  _id: string;
  title: string;
  correctAnswer: string;
  wrongAnswer?: string[];
}

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

export const QuestionCard = ({
  question,
  onEdit,
  onDelete,
}: QuestionCardProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white cursor-pointer w-full"
        onClick={() => setOpen(true)}
      >
        <div className="flex-1">
          <p className="text-md font-normal text-gray-800 truncate">
            {question.title}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(question);
            }}
          >
            <Pencil size={14} />
          </Button>

          <Button
            variant="outline"
            className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(question._id);
            }}
          >
            <Trash size={14} />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {question.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
            <div className="border border-green-400 p-2 rounded-md bg-green-50">
              {question.correctAnswer}
            </div>

            {question.wrongAnswer?.length ? (
              question.wrongAnswer.map((ans, index) => (
                <div
                  key={index}
                  className="border border-red-400 p-2 rounded-md bg-red-50"
                >
                  {ans}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No wrong answers.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
