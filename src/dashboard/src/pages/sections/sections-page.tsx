import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteModal from '@/components/ui/delete-modal';
import { DataTable } from '@/components/ui/data-table';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/ui/page-header';
import SectionModal from '@/components/section/section-modal';
import { useDeleteModal } from '@/hooks/use-delete-modal';
import { sectionService } from '@/services/section.service';

import type { SectionDto } from 'dtos';

export default function SectionsPage() {
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionDto | null>(
    null,
  );
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

  const navigate = useNavigate();

  const {
    itemToDelete: sectionToDelete,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useDeleteModal<SectionDto>(
    'Failed to delete the section. Please try again later.',
  );

  useEffect(() => {
    let isMounted = true;

    sectionService
      .getAllSections()
      .then((data) => {
        if (isMounted) {
          setSections(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch sections:', error);

        if (isMounted) {
          setSections([]);
          setFetchError('Failed to load sections. Please try again later.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditSection = async (sectionId: number) => {
    try {
      const section = await sectionService.getSectionById(sectionId);

      setSelectedSection(section);
      setIsSectionModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch section:', error);
    }
  };

  const handleCloseSectionModal = () => {
    setIsSectionModalOpen(false);
    setSelectedSection(null);
  };

  const handleSectionUpdateSuccess = (updatedSection: SectionDto) => {
    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === updatedSection.id ? updatedSection : section,
      ),
    );

    handleCloseSectionModal();
  };

  const handleCreateSection = (createdSection: SectionDto) => {
    setSections((previousSections) => [...previousSections, createdSection]);
    handleCloseSectionModal();
  };

  const handleConfirmDelete = async () => {
    await handleDelete(
      (sectionToRemove) => sectionService.deleteSection(sectionToRemove.id),
      (deletedSection) => {
        setSections((current) =>
          current.filter((section) => section.id !== deletedSection.id),
        );
      },
    );
  };

  const columns: DataTableColumn<SectionDto>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'academicYear',
      header: 'Academic Year',
      accessorKey: 'academicYear',
    },
    {
      id: 'gradeId',
      header: 'Grade',
      accessorKey: 'gradeId',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <PageHeader
        title="Sections"
        description="A list of sections within your institute."
        action={{
          label: 'Add Section',
          onClick: () => {
            setSelectedSection(null);
            setIsSectionModalOpen(true);
          },
        }}
      />

      <DataTable
        columns={columns}
        data={sections}
        rowKey="id"
        isLoading={isLoading}
        loadingMessage="Loading sections..."
        error={fetchError ?? undefined}
        emptyMessage="No sections available."
        onRowClick={(section) => navigate(`${section.id}`)}
        actions={(section) => (
          <DropdownMenu
            items={[
              {
                label: 'Edit',
                onSelect: () => handleEditSection(section.id),
              },
              {
                label: 'Delete',
                variant: 'destructive',
                onSelect: () => openDeleteModal(section),
              },
            ]}
          />
        )}
      />

      <DeleteModal
        open={sectionToDelete !== null}
        title="Confirm Delete"
        message={
          <>
            Are you sure you want to delete{' '}
            <span className="font-semibold">{sectionToDelete?.name}</span>?
          </>
        }
        onConfirm={handleConfirmDelete}
        onClose={closeDeleteModal}
        isLoading={isDeleting}
        error={deleteError}
      />

      <SectionModal
        open={isSectionModalOpen}
        onClose={handleCloseSectionModal}
        onCreateSuccess={handleCreateSection}
        onUpdateSuccess={handleSectionUpdateSuccess}
        section={selectedSection ?? undefined}
      />
    </div>
  );
}
