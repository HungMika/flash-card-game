'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteSubject, updateSubject } from '@/services/subject';
import Link from 'next/link';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useConfirm } from './use-confirm';
import toast from 'react-hot-toast';

const ageGroups = ['1-2', '3-5', '6-8', '9-12'];

interface SubjectCardProps {
  id: string;
  name: string;
  ageGroup: string;
  onChange: () => void;
}

export const SubjectCard = ({
  id,
  name,
  ageGroup,
  onChange,
}: SubjectCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newAgeGroup, setNewAgeGroup] = useState(ageGroup);

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'This action cannot be undone',
  );

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      await deleteSubject(id);
      toast.success('Subject deleted successfully');
      onChange();
    } catch (error) {
      toast.error('Error deleting subject');
      //console.error('Error deleting subject:', error);
    }
  };

  const handleEdit = async () => {
    if (!newName.trim() || !newAgeGroup.trim()) return;
    try {
      await updateSubject(id, newName.trim(), newAgeGroup.trim());
      toast.success('Subject updated successfully');
      setEditOpen(false);
      onChange();
    } catch (error) {
      toast.error('Error updating subject');
      //console.error('Error updating subject:', error);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Card className="p-4 flex items-center justify-between hover:shadow-md">
        <Link
          href={`/dashboard/age-group/${ageGroup}/subject/${id}`}
          className="font-medium text-base text-primary hover:underline"
        >
          {name}
        </Link>

        <div className="flex items-center gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4 text-blue-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-lg">
              <DialogHeader>
                <DialogTitle>Edit Subject</DialogTitle>
              </DialogHeader>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Tên mới"
              />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Age Group
                </label>
                <select
                  value={newAgeGroup}
                  onChange={(e) => setNewAgeGroup(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  {ageGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={handleEdit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </Card>
    </>
  );
};
