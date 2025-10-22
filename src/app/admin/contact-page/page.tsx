"use client";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  getPaginatedContacts,
  deleteContact,
  updateContact,
  getUniqueSubjects,
} from "@/app/actions/contact.actions";
import {
  ContactDocument,
  PaginatedContactsResponse,
  ContactFilters,
} from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactDocument[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedContactsResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [filters, setFilters] = useState<ContactFilters>({});
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >();

  const debouncedSearch = useDebounce(search, 300);

  const fetchContacts = useCallback(
    async (
      page: number,
      searchTerm: string = "",
      filters: ContactFilters = {}
    ) => {
      setLoading(true);
      try {
        const result = await getPaginatedContacts(
          page,
          10,
          searchTerm,
          filters
        );
        if (result.success && result.data) {
          setContacts(result.data.contacts);
          setPagination(result.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchSubjects = useCallback(async () => {
    try {
      const result = await getUniqueSubjects();
      if (result.success && result.data) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters]);

  useEffect(() => {
    const appliedFilters = { ...filters };
    if (dateRange) {
      appliedFilters.dateRange = {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      };
    }
    fetchContacts(currentPage, debouncedSearch, appliedFilters);
  }, [currentPage, debouncedSearch, filters, dateRange, fetchContacts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const result = await deleteContact(id);
      if (result.success) {
        fetchContacts(currentPage, debouncedSearch, filters);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact");
    }
  };

  const handleUpdate = async (
    id: string,
    updates: Partial<ContactDocument>
  ) => {
    try {
      const result = await updateContact(id, updates);
      if (result.success) {
        fetchContacts(currentPage, debouncedSearch, filters);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({});
    setDateRange(undefined);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
          <CardDescription>
            Manage and review all contact form submissions from your website.
          </CardDescription>
        </CardHeader>
        <CardContent>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="grid gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateRange && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd, y")} -{" "}
                                  {format(dateRange.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={{
                              from: dateRange?.from,
                              to: dateRange?.to,
                            }}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                setDateRange({
                                  from: range.from,
                                  to: range.to,
                                });
                              } else if (range?.from) {
                                setDateRange({
                                  from: range.from,
                                  to: range.from,
                                });
                              } else {
                                setDateRange(undefined);
                              }
                            }}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Subject</label>
                   <Select
  value={filters.subject || ""}
  onValueChange={(value) => 
    setFilters(prev => ({ 
      ...prev, 
      subject: value === "all" ? undefined : value 
    }))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Select subject" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All subjects</SelectItem>
    {subjects.map((subject) => (
      <SelectItem key={subject} value={subject}>
        {truncateText(subject, 30)}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {pagination && (
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-3 bg-muted rounded-lg gap-2">
              <p className="text-sm text-muted-foreground">
                Showing <strong>{(currentPage - 1) * 10 + 1}</strong> to{" "}
                <strong>
                  {Math.min(currentPage * 10, pagination.totalContacts)}
                </strong>{" "}
                of <strong>{pagination.totalContacts}</strong> contacts
              </p>
              <Badge variant="secondary">
                Page {pagination.currentPage} of {pagination.totalPages}
              </Badge>
            </div>
          )}


          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                No contact submissions found.
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="font-semibold">{contact.name}</div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="max-w-[150px] truncate"
                        >
                          {contact.subject}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div
                          className="text-sm text-muted-foreground cursor-help"
                          title={contact.message}
                        >
                          {truncateText(contact.message, 80)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(contact.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(
                                  `mailto:${contact.email}?subject=Re: ${contact.subject}`
                                )
                              }
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                const newSubject = prompt(
                                  "Enter new subject:",
                                  contact.subject
                                );
                                if (
                                  newSubject &&
                                  newSubject !== contact.subject
                                ) {
                                  handleUpdate(contact._id, {
                                    subject: newSubject,
                                  });
                                }
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Subject
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(contact._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {pagination.totalContacts} total submissions
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages)
                    )
                  }
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
