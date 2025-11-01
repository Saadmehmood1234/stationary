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
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="relative min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 overflow-hidden p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "60%", right: "10%" }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
            animate={{
              y: [0, -60, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#D5D502] to-[#D5D502]/80"></div>
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent">
                Contact Submissions
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Manage and review all contact form submissions from your website.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-yellow-400 to-[#D5D502]"></div>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search contacts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50"
                  />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto rounded-full border-white/20 text-white bg-gray-800 cursor-pointer hover:text-gray-100 hover:bg-gray-800/10"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-white/20 text-white">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-200">Date Range</label>
                        <div className="grid gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl",
                                  !dateRange && "text-gray-400"
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
                            <PopoverContent className="w-auto p-0 bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-white/20" align="start">
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
                                className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 text-white"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-200">Subject</label>
                        <Select
                          value={filters.subject || ""}
                          onValueChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              subject: value === "all" ? undefined : value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent className="text-white hover:text-white bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-white/20">
                            <SelectItem value="all" className="focus:bg-white/10 text-white">All subjects</SelectItem>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject} className="focus:bg-white/10 text-white">
                                {truncateText(subject, 30)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full border-white/20 bg-gray-800 cursor-pointer hover:text-white text-white hover:bg-gray-800/10 rounded-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button 
                  onClick={() => fetchContacts(currentPage, debouncedSearch, filters)}
                  className="bg-gradient-to-r from-[#D5D502] to-yellow-500 hover:from-[#c4c401] hover:to-yellow-600 text-gray-900 border-0 rounded-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Pagination Info */}
              {pagination && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col sm:flex-row justify-between items-center mb-4 p-3 bg-white/5 rounded-xl gap-2 border border-white/10"
                >
                  <p className="text-sm text-gray-300">
                    Showing <strong className="text-white">{(currentPage - 1) * 10 + 1}</strong> to{" "}
                    <strong className="text-white">
                      {Math.min(currentPage * 10, pagination.totalContacts)}
                    </strong>{" "}
                    of <strong className="text-white">{pagination.totalContacts}</strong> contacts
                  </p>
                  <Badge variant="outline" className="bg-white/10 text-gray-300 border-white/20">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </Badge>
                </motion.div>
              )}

              {/* Table */}
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-white/10 rounded-xl" />
                  ))}
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">No contact submissions found.</div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/20 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-300 font-semibold">Name</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Email</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Subject</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Message</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Date Submitted</TableHead>
                        <TableHead className="text-gray-300 font-semibold w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact, index) => (
                        <motion.tr
                          key={contact._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                          <TableCell className="font-medium">
                            <div className="font-semibold text-white">{contact.name}</div>
                          </TableCell>
                          <TableCell>
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-[#D5D502] hover:text-[#D5D502]/70 cursor-pointer hover:underline flex items-center gap-1 transition-colors"
                            >
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="max-w-[150px] truncate bg-white/10 text-gray-300 border-white/20"
                            >
                              {contact.subject}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <div
                              className="text-sm text-gray-400 cursor-help hover:text-gray-300 transition-colors"
                              title={contact.message}
                            >
                              {truncateText(contact.message, 80)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-400">
                              {formatDate(contact.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-xl">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-white/20 text-white">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      `mailto:${contact.email}?subject=Re: ${contact.subject}`
                                    )
                                  }
                                  className="focus:bg-white/10"
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Reply
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/20" />
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
                                  className="focus:bg-white/10"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Subject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(contact._id)}
                                  className="text-red-400 focus:bg-red-500/10 focus:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {pagination && pagination.totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 py-4 border-t border-white/10"
                >
                  <div className="flex-1 text-sm text-gray-400">
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
                      className="border-white/20 hover:text-gray-100 scale-[1.2] text-white hover:bg-gray-800/10 rounded-full cursor-pointer bg-gray-800  disabled:opacity-50"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-400 px-4">
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
                      className="border-white/20 hover:text-gray-100 scale-[1.2] text-white hover:bg-gray-800/10 rounded-full cursor-pointer bg-gray-800  disabled:opacity-50"
                    >
                      Next
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}