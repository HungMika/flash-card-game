'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, Plus, Trash2 } from 'lucide-react';
import { updateQuestion } from '@/services/question';

interface EditQuestionModalProps {
  question: {
    _id: string;
    title: string;
    correctAnswer: string;
    wrongAnswer: string[];
  } | null;
  subjectId: string;
  onClose: () => void;
  onQuestionUpdated: () => void;
}

export const EditQuestionModal = ({
  question,
  subjectId,
  onClose,
  onQuestionUpdated,
}: EditQuestionModalProps) => {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [wrongAnswer, setWrongAnswer] = useState<string[]>([]);

  useEffect(() => {
    if (question) {
      setTitle(question.title || '');
      setCorrectAnswer(question.correctAnswer || '');
      setWrongAnswer(question.wrongAnswer ?? []);
    }
  }, [question]);

  const handleAddWrongAnswer = () => {
    setWrongAnswer([...wrongAnswer, '']);
  };

  const handleRemoveWrongAnswer = (index: number) => {
    setWrongAnswer((prev) => prev.filter((_, i) => i !== index));
  };

  const handleWrongAnswerChange = (index: number, value: string) => {
    setWrongAnswer((prev) => prev.map((ans, i) => (i === index ? value : ans)));
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedCorrectAnswer = correctAnswer.trim();
    const filteredWrongAnswer = wrongAnswer
      .map((ans) => ans.trim())
      .filter((ans) => ans !== '');

    if (
      !trimmedTitle ||
      !trimmedCorrectAnswer ||
      filteredWrongAnswer.length === 0
    ) {
      alert('Please fill all fields!');
      return;
    }

    setLoading(true);
    try {
      console.log('Updating question:', {
        title: trimmedTitle,
        correctAnswer: trimmedCorrectAnswer,
        wrongAnswer: filteredWrongAnswer,
      });

      await updateQuestion(question!._id, {
        title: trimmedTitle,
        correctAnswer: trimmedCorrectAnswer,
        wrongAnswer: filteredWrongAnswer,
      });

      onClose();
      onQuestionUpdated();
    } catch (error) {
      console.error('Error updating question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!question} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập câu hỏi..."
          />

          <div className="relative">
            <Input
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Nhập đáp án đúng..."
              className="border-green-500 focus:ring-green-500"
            />
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600 text-sm">
            <CheckCircleIcon className="w-4 h-4" />
            </span>
          </div>

          {/* Danh sách đáp án sai */}
          <div className="max-h-[200px] overflow-y-auto scrollbar-hide space-y-2">
            {wrongAnswer.map((ans, index) => (
              <div key={index} className="relative flex items-center">
                <Input
                  value={ans}
                  onChange={(e) =>
                    handleWrongAnswerChange(index, e.target.value)
                  }
                  placeholder={`Nhập đáp án sai ${index + 1}...`}
                  className="border-red-400 focus:ring-red-500"
                />
                {wrongAnswer.length > 1 && (
                  <button
                    onClick={() => handleRemoveWrongAnswer(index)}
                    className="absolute right-3 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleAddWrongAnswer}
          >
            <Plus size={16} className="mr-1" /> Add more wrong answers
          </Button>
        </div>

        <DialogFooter className="mt-6">
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
