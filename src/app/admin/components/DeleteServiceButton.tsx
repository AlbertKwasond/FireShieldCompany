'use client';

import React, { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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
import { deleteService } from '@/app/actions/serviceActions';

export default function DeleteServiceButton({
  serviceId,
  serviceTitle,
}: {
  serviceId: string;
  serviceTitle: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const toastId = toast.loading(`Deleting "${serviceTitle}"…`);
    startTransition(async () => {
      const result = await deleteService(serviceId);
      if (result.success) {
        toast.success(`"${serviceTitle}" was deleted successfully.`, { id: toastId });
      } else {
        const msg = result.error ?? `Failed to delete "${serviceTitle}". Please try again.`;
        toast.error(msg, { id: toastId });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="admin-icon-btn"
          style={{ color: 'var(--admin-danger)' }}
          title="Delete Service"
          disabled={isPending}
        >
          <Trash2 size={16} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{serviceTitle}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This action <strong>cannot be undone</strong>. The service will be permanently
            removed from the database and will no longer appear on the public website.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="danger" onClick={handleDelete}>
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
