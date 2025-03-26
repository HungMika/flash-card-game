'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createSubject } from '@/services/subject';
import { getCookie } from '@/lib/cookie';

interface AddSubjectModalProps {
  user: { _id: string };
  ageGroup: string;
  onSubjectAdded: () => void;
}

export const AddSubjectModal = ({
  user,
  ageGroup,
  onSubjectAdded,
}: AddSubjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const subjectNameRef = useRef<HTMLInputElement | null>(null);

  console.log('User in AddSubjectModal:', user);

  useEffect(() => {
    const storedUserId = getCookie('userId');
    console.log('Fetched userId from cookie:', storedUserId);
    setUserId(storedUserId || null);
  }, []);

  const handleAdd = async () => {
    const subjectName = subjectNameRef.current?.value.trim();
    if (!subjectName) return;

    console.log('User ID:', userId);

    if (!userId) {
      console.error('Không tìm thấy userId trong cookie.');
      return;
    }

    setLoading(true);
    try {
      await createSubject(userId, subjectName, ageGroup);
      subjectNameRef.current!.value = ''; // Clear input
      setOpen(false);
      onSubjectAdded();
    } catch (error) {
      console.error('Lỗi khi thêm subject:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add subject</Button>
      </DialogTrigger>

      <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-lg">
        <DialogHeader>
          <DialogTitle>Add new subject</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            ref={subjectNameRef}
            placeholder="Tên subject (VD: Toán, Khoa học...)"
          />
        </div>

        <DialogFooter className="mt-6">
          <Button disabled={loading} onClick={handleAdd}>
            {loading ? 'Loading...' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
