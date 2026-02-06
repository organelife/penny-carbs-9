import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, FileSpreadsheet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Panchayat {
  id: string;
  name: string;
}

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  panchayats: Panchayat[];
  selectedPanchayat: string;
  onPanchayatChange: (value: string) => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
}

const UsersFilters: React.FC<UsersFiltersProps> = ({
  searchTerm,
  onSearchChange,
  panchayats,
  selectedPanchayat,
  onPanchayatChange,
  onExportCSV,
  onExportExcel,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedPanchayat} onValueChange={onPanchayatChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Panchayats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Panchayats</SelectItem>
            {panchayats.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UsersFilters;
