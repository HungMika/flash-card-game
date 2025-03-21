"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createSubject } from "@/services/api";
import { getTeacher } from "@/lib/storage";

interface AddSubjectModalProps {
  ageGroup: string;
  onSubjectAdded: () => void;
}

export const AddSubjectModal = ({
  ageGroup,
  onSubjectAdded,
}: AddSubjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);

  const teacherId = getTeacher()?.id || "";

  const handleAdd = async () => {
    if (!subjectName.trim()) return;
    setLoading(true);
    try {
      await createSubject(subjectName, ageGroup, teacherId);
      setSubjectName("");
      setOpen(false);
      onSubjectAdded();
    } catch (error) {
      console.error("Lỗi khi thêm subject:", error);
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
            placeholder="Tên subject (VD: Toán, Khoa học...)"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-6">
          <Button disabled={loading} onClick={handleAdd}>
            {loading ? "Loading..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
