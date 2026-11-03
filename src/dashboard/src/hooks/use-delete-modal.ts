import { useState, useCallback } from 'react';

export function useDeleteModal<T>(
  errorMessage: string = 'Failed to delete this item.',
) {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

  const openDeleteModal = useCallback((item: T) => {
    setItemToDelete(item);
    setDeleteError(undefined);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setItemToDelete(null);
    setDeleteError(undefined);
  }, []);

  const handleDelete = useCallback(
    async (
      deleteAction: (item: T) => Promise<void>,
      onSuccess?: (item: T) => void,
    ) => {
      if (itemToDelete === null) return;

      let deleteSuccessful = false;

      try {
        setIsDeleting(true);
        setDeleteError(undefined);

        await deleteAction(itemToDelete);
        deleteSuccessful = true;
      } catch (error) {
        console.error('Delete action failed:', error);
        setDeleteError(errorMessage);
      } finally {
        setIsDeleting(false);
      }

      if (deleteSuccessful) {
        onSuccess?.(itemToDelete);
        closeDeleteModal();
      }
    },
    [itemToDelete, closeDeleteModal, errorMessage],
  );

  return {
    itemToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
}
