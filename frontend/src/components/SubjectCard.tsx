'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// UI Components
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// Services + Hooks
import { deleteSubject, updateSubject } from '@/services/subject';
import { useConfirm } from './use-confirm';

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
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newAgeGroup, setNewAgeGroup] = useState(ageGroup);
  const [loading, setLoading] = useState(false);

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'This action cannot be undone'
  );

  // DELETE SUBJECT
  const handleDelete = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      await deleteSubject(id);
      toast.success('Subject deleted successfully');
      onChange();
    } catch (error) {
      toast.error('Error deleting subject');
    }
  };

  // EDIT SUBJECT
  const handleEdit = async () => {
    const trimmedName = newName.trim();
    const trimmedAgeGroup = newAgeGroup.trim();

    if (!trimmedName || !trimmedAgeGroup) {
      toast.error('Please enter valid name and age group.');
      return;
    }

    try {
      await updateSubject(id, trimmedName, trimmedAgeGroup);
      toast.success('Subject updated successfully');
      setEditOpen(false);
      onChange();
    } catch (error) {
      toast.error('Error updating subject');
    }
  };

  // NAVIGATE TO SUBJECT DETAIL
  const handleNavigate = async () => {
    if (loading) return;
    setLoading(true);
    router.replace(`/dashboard/age-group/${ageGroup}/subject/${id}`);
  };

  return (
    <>
      <ConfirmDialog />
      <Card
        onClick={handleNavigate}
        className="relative p-4 flex items-center justify-between hover:shadow-md cursor-pointer min-h-[80px]"
      >
        {/* Overlay Loading */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        {/* Left: Subject name */}
        <div className="flex flex-col gap-2 justify-center z-0">
          <p className="font-semibold text-base text-primary">{name}</p>
        </div>

        {/* Right: Action buttons */}
        <div
          className="flex items-center gap-2 z-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Dialog
            open={editOpen}
            onOpenChange={(open) => {
              setEditOpen(open);
              if (!open) {
                setNewName(name);
                setNewAgeGroup(ageGroup);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4 text-blue-500" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-lg">
              <DialogHeader>
                <DialogTitle>Edit Subject</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New Subject Name"
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
              </div>

              <DialogFooter className="mt-4">
                <Button
                  onClick={handleEdit}
                  className="bg-[#3f99e9] hover:bg-blue-500 font-semibold cursor-pointer text-white"
                >
                  Save
                </Button>
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
