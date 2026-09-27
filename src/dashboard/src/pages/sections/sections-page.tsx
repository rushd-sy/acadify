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
import { sectionService } from '@/services/section.service';
import type { SectionDto } from 'dtos';
import SectionModal from '@/components/section/section-modal';

export default function SectionsPage() {
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionDto | null>(
    null,
  );
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

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
                  <TableCell>
                    <Button
                      variant="secondary"
                      onClick={() => handleEditSection(section.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
