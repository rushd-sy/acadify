import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import DeleteModal from '@/components/ui/delete-modal';
import SectionModal from '@/components/section/section-modal';
import { sectionService } from '@/services/section.service';
import type { SectionDto } from 'dtos';
import { PageHeader } from '@/components/ui/page-header';
import { useDeleteModal } from '@/hooks/use-delete-modal';

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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-base">
              <TableHead className="py-5">Name</TableHead>
              <TableHead className="py-5">Academic Year</TableHead>
              <TableHead className="py-5">Grade</TableHead>
              <TableHead className="py-5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-base">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  Loading sections...
                </TableCell>
              </TableRow>
            ) : fetchError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-red-600"
                >
                  {fetchError}
                </TableCell>
              </TableRow>
            ) : sections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  No sections available.
                </TableCell>
              </TableRow>
            ) : (
              sections.map((section) => (
                <TableRow
                  key={section.id}
                  className="h-16 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigate(`${section.id}`)}
                >
                  <TableCell className="font-medium">{section.name}</TableCell>

                  <TableCell>{section.academicYear}</TableCell>

                  <TableCell>{section.gradeId}</TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      variant="secondary"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEditSection(section.id);
                      }}
                    >
                      Edit
                    </Button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openDeleteModal(section);
                      }}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
      </div>

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
