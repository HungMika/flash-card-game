"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSubject, updateSubjectName } from "@/services/api";
import { getTeacher } from "@/lib/storage";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useConfirm } from "./use-confirm";

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

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "this action cannot be undone"
  );

  const teacher = getTeacher();

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (!teacher) return;
    if (!confirmed) return;
    await deleteSubject(id, teacher.id);
    onChange();
  };

  const handleEdit = async () => {
    if (!teacher || !newName.trim()) return;
    await updateSubjectName(id, newName.trim(), teacher.id);
    setEditOpen(false);
    onChange();
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

        {/* Icon sửa + xoá bên phải */}
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
