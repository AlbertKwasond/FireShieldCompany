'use client';

import React, { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteIndustry } from '@/app/actions/industryActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function DeleteIndustryButton({
  industryId,
  industryTitle,
}: {
  industryId: string;
  industryTitle: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const toastId = toast.loading(`Deleting "${industryTitle}"...`);
      try {
        const res = await deleteIndustry(industryId);
        if (!res?.success) {
          toast.error(res?.error || 'Failed to delete industry', { id: toastId });
          return;
        }
        toast.success('Industry deleted successfully', { id: toastId });
      } catch (err) {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="admin-icon-btn admin-icon-btn-danger"
          title="Delete Industry"
          disabled={isPending}
        >
          <Trash2 size={16} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the industry "
            <strong>{industryTitle}</strong>" and remove it from the public website.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Yes, delete industry
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
