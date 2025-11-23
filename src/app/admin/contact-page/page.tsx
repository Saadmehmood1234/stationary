"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
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
  BarChart3,
  TrendingUp,
  Users,
  MessageCircle,
  Clock,
  ArrowUpDown,
  MailOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import EditSubject from "@/components/EditSubject";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import toast from "react-hot-toast";

interface EditingData {
  contactId: string;
  subject: string;
}

type SortField = "name" | "email" | "subject" | "createdAt" | "message";
type SortDirection = "asc" | "desc";

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
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  const [editingModal, setEditingModal] = useState<{
    isOpen: boolean;
    contactId: string;
    subject: string;
  }>({
    isOpen: false,
    contactId: "",
    subject: "",
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    contactId: string;
    contactName: string;
  }>({
    isOpen: false,
    contactId: "",
    contactName: "",
  });
  
  const debouncedSearch = useDebounce(search, 300);

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!contacts.length) return null;

    const totalContacts = contacts.length;
    const today = new Date();
    const last7Days = new Date(today.setDate(today.getDate() - 7));
    
    const recentContacts = contacts.filter(
      contact => new Date(contact.createdAt) > last7Days
    ).length;

    const uniqueSubjects = [...new Set(contacts.map(contact => contact.subject))].length;
    
    const contactsBySubject = contacts.reduce((acc, contact) => {
      acc[contact.subject] = (acc[contact.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonSubject = Object.entries(contactsBySubject)
      .sort(([,a], [,b]) => b - a)[0] || ['None', 0];

    const averageMessageLength = contacts.reduce((sum, contact) => 
      sum + contact.message.length, 0) / totalContacts;

    // Contacts by time of day (mock data for demonstration)
    const morningContacts = contacts.filter(contact => {
      const hour = new Date(contact.createdAt).getHours();
      return hour >= 6 && hour < 12;
    }).length;

    const afternoonContacts = contacts.filter(contact => {
      const hour = new Date(contact.createdAt).getHours();
      return hour >= 12 && hour < 18;
    }).length;

    const eveningContacts = contacts.filter(contact => {
      const hour = new Date(contact.createdAt).getHours();
      return hour >= 18 || hour < 6;
    }).length;

    return {
      totalContacts,
      recentContacts,
      uniqueSubjects,
      mostCommonSubject,
      averageMessageLength,
      contactsBySubject,
      morningContacts,
      afternoonContacts,
      eveningContacts,
    };
  }, [contacts]);

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter((contact) => {
      // Search filter
      const matchesSearch = 
        contact.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        contact.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        contact.subject.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        contact.message.toLowerCase().includes(debouncedSearch.toLowerCase());

      // Subject filter
      const matchesSubject = !filters.subject || contact.subject === filters.subject;

      // Date range filter
      let matchesDateRange = true;
      if (dateRange?.from && dateRange?.to) {
        const contactDate = new Date(contact.createdAt);
        matchesDateRange = contactDate >= dateRange.from && contactDate <= dateRange.to;
      }

      return matchesSearch && matchesSubject && matchesDateRange;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [contacts, debouncedSearch, filters.subject, dateRange, sortField, sortDirection]);

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
    try {
      const result = await deleteContact(id);
      if (result.success) {
        fetchContacts(currentPage, debouncedSearch, filters);
        setDeleteModal({ isOpen: false, contactId: "", contactName: "" });
        toast.success("Deleted Successfully!")
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
        setEditingModal({ isOpen: false, contactId: "", subject: "" });
         toast.success("Updated Successfully!")
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
    setSortField("createdAt");
    setSortDirection("desc");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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

  const openDeleteModal = (contactId: string, contactName: string) => {
    setDeleteModal({
      isOpen: true,
      contactId,
      contactName,
    });
  };

  const handleEditing = (subject: string, contactId: string) => {
    setEditingModal({
      isOpen: true,
      contactId,
      subject,
    });
  };

  // Simple bar chart for subject distribution
  const SubjectBarChart = ({ contacts }: { contacts: ContactDocument[] }) => {
    const subjectCounts = contacts.reduce((acc, contact) => {
      acc[contact.subject] = (acc[contact.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSubjects = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const maxCount = Math.max(...topSubjects.map(([, count]) => count));

    return (
      <div className="space-y-2">
        {topSubjects.map(([subject, count]) => (
          <div key={subject} className="flex items-center space-x-3">
            <div className="w-32 text-sm text-gray-300 truncate">
              {truncateText(subject, 20)}
            </div>
            <div className="flex-1">
              <div
                className="bg-gradient-to-r from-[#D5D502] to-yellow-500 rounded-full h-3 transition-all duration-500"
                style={{
                  width: `${(count / maxCount) * 100}%`,
                }}
              />
            </div>
            <div className="w-8 text-right text-sm text-white font-medium">
              {count}
            </div>
          </div>
        ))}
      </div>
    );
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

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Contacts */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Contacts</p>
                    <p className="text-2xl font-bold text-white">{analytics.totalContacts}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {analytics.recentContacts} this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Unique Subjects */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Unique Subjects</p>
                    <p className="text-2xl font-bold text-white">{analytics.uniqueSubjects}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      Top: {truncateText(analytics.mostCommonSubject[0], 15)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <MailOpen className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Message Length */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Avg Message</p>
                    <p className="text-2xl font-bold text-[#D5D502]">
                      {Math.round(analytics.averageMessageLength)} chars
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Per contact
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <MessageCircle className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">This Week</p>
                    <p className="text-2xl font-bold text-green-400">{analytics.recentContacts}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      New submissions
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <TrendingUp className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Highlights Section */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject Distribution */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                  Top Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectBarChart contacts={contacts} />
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  Contact Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-gray-300">Morning</span>
                    <span className="text-white font-bold">{analytics.morningContacts}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-gray-300">Afternoon</span>
                    <span className="text-white font-bold">{analytics.afternoonContacts}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-gray-300">Evening</span>
                    <span className="text-white font-bold">{analytics.eveningContacts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Contacts */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  Recent Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contacts
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map(contact => (
                      <div key={contact._id} className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-sm font-medium truncate">
                            {contact.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {truncateText(contact.subject, 25)}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-yellow-400 to-[#D5D502]"></div>
            <CardContent className="p-6">
              {/* Search and Filter Controls */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search contacts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-full focus:ring-2 focus:ring-[#D5D502]/50"
                  />
                </div>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-white/20 cursor-pointer text-gray-300 bg-white/5 rounded-full hover:bg-white/10 hover:text-white"
                    >
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border border-white/20">
                    <DropdownMenuItem
                      onClick={() => handleSort('createdAt')}
                      className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                    >
                      Date {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort('name')}
                      className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                    >
                      Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort('email')}
                      className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                    >
                      Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort('subject')}
                      className="text-gray-300 cursor-pointer hover:bg-white/10 hover:text-white"
                    >
                      Subject {sortField === 'subject' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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
                        <label className="text-sm font-medium text-gray-200">
                          Date Range
                        </label>
                        <div className="grid gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full cursor-pointer justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20 rounded-xl",
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
                            <PopoverContent
                              className="w-auto p-0 bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-white/20"
                              align="start"
                            >
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
                        <label className="text-sm  font-medium text-gray-200">
                          Subject
                        </label>
                        <Select
                          value={filters.subject || ""}
                          onValueChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              subject: value === "all" ? undefined : value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-white/10 cursor-pointer border-white/20 text-white rounded-xl">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent className="text-white cursor-pointer hover:text-white bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-white/20">
                            <SelectItem
                              value="all"
                              className="focus:bg-white/10 text-white"
                            >
                              All subjects
                            </SelectItem>
                            {subjects.map((subject) => (
                              <SelectItem
                                key={subject}
                                value={subject}
                                className="focus:bg-white/10 focus:text-white cursor-pointer text-white"
                              >
                                {truncateText(subject, 30)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="flex-1 border-white/20 bg-gray-800 cursor-pointer hover:text-white text-white hover:bg-gray-800/10 rounded-full"
                        >
                          Clear All
                        </Button>
                        <Button
                          onClick={() =>
                            fetchContacts(currentPage, debouncedSearch, filters)
                          }
                          className="cursor-pointer bg-gradient-to-r from-[#D5D502] to-yellow-500 hover:from-[#c4c401] hover:to-yellow-600 text-gray-900 border-0 rounded-full"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-400">
                Showing {filteredAndSortedContacts.length} of {contacts.length} contacts
                {(search || filters.subject || dateRange) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="ml-2 text-xs text-[#D5D502] hover:text-[#D5D502]/80 hover:bg-[#D5D502]/10"
                  >
                    Clear filters
                  </Button>
                )}
              </div>

              {/* Table */}
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-12 w-full bg-white/10 rounded-xl"
                    />
                  ))}
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">
                    No contact submissions found.
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/20 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('name')}
                            className="p-0 hover:bg-transparent text-gray-300 font-semibold"
                          >
                            Name
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('email')}
                            className="p-0 hover:bg-transparent text-gray-300 font-semibold"
                          >
                            Email
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('subject')}
                            className="p-0 hover:bg-transparent text-gray-300 font-semibold"
                          >
                            Subject
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          Message
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('createdAt')}
                            className="p-0 hover:bg-transparent text-gray-300 font-semibold"
                          >
                            Date Submitted
                            <ArrowUpDown className="h-4 w-4 ml-2" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-gray-300 font-semibold w-[80px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedContacts.map((contact, index) => (
                        <motion.tr
                          key={contact._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                          <TableCell className="font-medium">
                            <div className="font-semibold text-white">
                              {contact.name}
                            </div>
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
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 cursor-pointer hover:bg-white/10 rounded-xl"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="cursor-pointer bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-white/20 text-white"
                              >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(
                                      `mailto:${contact.email}?subject=Re: ${contact.subject}`
                                    )
                                  }
                                  className="focus:bg-white/10 cursor-pointer hover:bg-gray-800 hover:text-white"
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Reply
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/20 cursor-pointer" />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleEditing(contact.subject, contact._id)
                                  }
                                  className="focus:bg-white/10 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Subject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    openDeleteModal(contact._id, contact.name)
                                  }
                                  className="text-red-400 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
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

              {/* Pagination */}
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
      {editingModal.isOpen && (
        <EditSubject
          handleUpdate={handleUpdate}
          subject={editingModal.subject}
          contactId={editingModal.contactId}
          isOpen={editingModal.isOpen}
          onClose={() =>
            setEditingModal({ isOpen: false, contactId: "", subject: "" })
          }
        />
      )}
      {deleteModal.isOpen && (
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({ isOpen: false, contactId: "", contactName: "" })
          }
          onConfirm={() => handleDelete(deleteModal.contactId)}
          title="Delete Contact"
          description={`Are you sure you want to delete the contact from "${deleteModal.contactName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}