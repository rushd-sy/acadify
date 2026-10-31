import { useState, useCallback } from 'react';

export function useDeleteModal<T>() {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openDeleteModal = useCallback((item: T) => {
    setItemToDelete(item);
    setDeleteError(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setItemToDelete(null);
    setDeleteError(null);
  }, []);

  const handleDelete = async (
    deleteAction: (item: T) => Promise<void>,
    onSuccess?: (item: T) => void,
  ) => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteAction(itemToDelete);

      onSuccess?.(itemToDelete);
      closeDeleteModal();
    } catch (error) {
      console.error('Delete action failed:', error);
      setDeleteError('Failed to delete this item. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    itemToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
}
