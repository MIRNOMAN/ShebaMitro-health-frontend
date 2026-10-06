import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function InventoryPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: InventoryPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-card-border bg-card shadow-xs text-xs">
      <span className="text-muted-foreground font-medium">
        Showing <strong className="text-fg-app">{startItem}</strong> to{" "}
        <strong className="text-fg-app">{endItem}</strong> of{" "}
        <strong className="text-fg-app">{totalItems}</strong> Medicine Stock Items
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5 text-xs font-semibold"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>

        <span className="font-mono font-bold text-fg-app px-2">
          Page {currentPage} of {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5 text-xs font-semibold"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
