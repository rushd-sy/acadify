import { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
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

export default function SectionsPage() {
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedSection, setSelectedSection] = useState<SectionDto | null>(
    null,
  );
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleDeleteClick = (section: SectionDto) => {
    setSelectedSection(section);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setSelectedSection(null);
    setDeleteError(null);
  };

  const handleDeleteSection = async () => {
    if (!selectedSection) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await sectionService.deleteSection(selectedSection.id);

      setSections((currentSections) =>
        currentSections.filter(
          (section) => section.id !== selectedSection.id,
        ),
      );

      setIsDeleteModalOpen(false);
      setSelectedSection(null);
    } catch (error) {
      console.error('Failed to delete section:', error);
      setDeleteError('Failed to delete section. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="pb-4">
            A list of sections within your institute.
          </TableCaption>

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
                <TableRow key={section.id} className="h-16">
                  <TableCell className="font-medium">{section.name}</TableCell>

                  <TableCell>{section.academicYear}</TableCell>

                  <TableCell>{section.gradeId}</TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEditSection(section.id)}
                    >
                      Edit
                    </Button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteClick(section);
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
          open={isDeleteModalOpen}
          title="Delete Section"
          message={
            <>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedSection?.name}</span>?
            </>
          }
          onConfirm={handleDeleteSection}
          onClose={handleCloseDeleteModal}
          isLoading={isDeleting}
          error={deleteError ?? undefined}
        />
      </div>

      <SectionModal
        open={isSectionModalOpen}
        onClose={handleCloseSectionModal}
        onSuccess={handleSectionUpdateSuccess}
        section={selectedSection ?? undefined}
      />
    </div>
  );
}
