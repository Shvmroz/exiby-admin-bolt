'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Globe,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';
import CustomTable, { TableHeader, MenuOption } from '@/components/ui/custom-table';
import ConfirmDeleteDialog from '@/components/ui/confirm-delete-dialog';
import EventEditDialog from '@/components/events/EventEditDialog';
import EventCreateDialog from '@/components/events/EventCreateDialog';
import EventDetailView from '@/components/events/EventDetailView';
import CustomDrawer from '@/components/ui/custom-drawer';
import EventFilters from '@/components/events/EventFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CsvExportDialog from '@/components/ui/csv-export-dialog';
import { Badge } from '@/components/ui/badge';
import TableSkeleton from '@/components/ui/skeleton/table-skeleton';

interface Event {
  _id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  venue: {
    type: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    virtual_link: string;
    platform: string;
  };
  status: string;
  ticketPrice: number;
  currency: string;
  isPaidEvent: boolean;
  max_attendees: number;
  registration_deadline: string;
  is_public: boolean;
  created_at: string;
}

// Dummy data
const dummyData = {
  data: {
    events: [
      {
        _id: "event_123",
        title: "Annual Tech Conference 2024",
        description: "Join us for the biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities.",
        startAt: "2025-12-15T09:00:00.000Z",
        endAt: "2025-12-15T18:00:00.000Z",
        venue: {
          type: "hybrid",
          address: "123 Convention Center Drive",
          city: "San Francisco",
          state: "California",
          country: "USA",
          postal_code: "94102",
          virtual_link: "https://zoom.us/j/1234567890",
          platform: "Zoom"
        },
        status: "published",
        ticketPrice: 299.99,
        currency: "USD",
        isPaidEvent: true,
        max_attendees: 500,
        registration_deadline: "2025-12-10T23:59:59.000Z",
        is_public: true,
        created_at: "2025-08-15T10:30:00.000Z"
      },
      {
        _id: "event_124",
        title: "Digital Marketing Workshop",
        description: "Learn the latest digital marketing strategies and tools from industry experts.",
        startAt: "2025-11-20T14:00:00.000Z",
        endAt: "2025-11-20T17:00:00.000Z",
        venue: {
          type: "physical",
          address: "456 Business Plaza",
          city: "New York",
          state: "New York",
          country: "USA",
          postal_code: "10001",
          virtual_link: "",
          platform: ""
        },
        status: "draft",
        ticketPrice: 149.99,
        currency: "USD",
        isPaidEvent: true,
        max_attendees: 100,
        registration_deadline: "2025-11-15T23:59:59.000Z",
        is_public: false,
        created_at: "2025-08-10T14:20:00.000Z"
      },
      {
        _id: "event_125",
        title: "Free Startup Networking Event",
        description: "Connect with fellow entrepreneurs and investors in this free networking event.",
        startAt: "2025-10-30T18:00:00.000Z",
        endAt: "2025-10-30T21:00:00.000Z",
        venue: {
          type: "virtual",
          address: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
          virtual_link: "https://meet.google.com/abc-defg-hij",
          platform: "Google Meet"
        },
        status: "published",
        ticketPrice: 0,
        currency: "USD",
        isPaidEvent: false,
        max_attendees: 200,
        registration_deadline: "2025-10-28T23:59:59.000Z",
        is_public: true,
        created_at: "2025-08-05T09:15:00.000Z"
      },
      {
        _id: "event_126",
        title: "AI & Machine Learning Summit",
        description: "Explore the latest developments in artificial intelligence and machine learning.",
        startAt: "2025-11-05T10:00:00.000Z",
        endAt: "2025-11-06T16:00:00.000Z",
        venue: {
          type: "hybrid",
          address: "789 Tech Hub",
          city: "Austin",
          state: "Texas",
          country: "USA",
          postal_code: "73301",
          virtual_link: "https://teams.microsoft.com/l/meetup-join/xyz",
          platform: "Microsoft Teams"
        },
        status: "published",
        ticketPrice: 399.99,
        currency: "USD",
        isPaidEvent: true,
        max_attendees: 300,
        registration_deadline: "2025-11-01T23:59:59.000Z",
        is_public: true,
        created_at: "2025-07-28T16:45:00.000Z"
      },
      {
        _id: "event_127",
        title: "Web Development Bootcamp",
        description: "Intensive 3-day bootcamp covering modern web development technologies.",
        startAt: "2025-09-15T09:00:00.000Z",
        endAt: "2025-09-17T17:00:00.000Z",
        venue: {
          type: "physical",
          address: "321 Learning Center",
          city: "Seattle",
          state: "Washington",
          country: "USA",
          postal_code: "98101",
          virtual_link: "",
          platform: ""
        },
        status: "cancelled",
        ticketPrice: 599.99,
        currency: "USD",
        isPaidEvent: true,
        max_attendees: 50,
        registration_deadline: "2025-09-10T23:59:59.000Z",
        is_public: true,
        created_at: "2025-07-20T11:30:00.000Z"
      }
    ],
    total: 5
  }
};



const EventsPageClient: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    event: Event | null;
  }>({ open: false, event: null });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    event: Event | null;
  }>({ open: false, event: null });
  const [createDialog, setCreateDialog] = useState(false);
  const [detailView, setDetailView] = useState<{
    open: boolean;
    event: Event | null;
  }>({ open: false, event: null });
  
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [venueTypeFilter, setVenueTypeFilter] = useState('all');
  const [paidOnlyFilter, setPaidOnlyFilter] = useState(false);
  const [publicOnlyFilter, setPublicOnlyFilter] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  // Load events
  const loadEvents = async () => {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredData = dummyData.data.events;
      
      if (searchQuery) {
        filteredData = filteredData.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setEvents(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [searchQuery, pagination.page, pagination.limit]);

  if (loading && events.length === 0) {
    return <TableSkeleton rows={8} columns={7} showFilters={true} />;
  }

  const handleChangePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleEdit = (event: Event) => {
    setEditDialog({ open: true, event });
  };

  const handleDelete = (event: Event) => {
    setDeleteDialog({ open: true, event });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.event) return;
    
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEvents(prev => 
        prev.filter(event => event._id !== deleteDialog.event!._id)
      );
      
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      setDeleteDialog({ open: false, event: null });
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (updatedEvent: Event) => {
    setEditLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEvents(prev =>
        prev.map(event => event._id === updatedEvent._id ? updatedEvent : event)
      );
      
      setEditDialog({ open: false, event: null });
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async (newEvent: Event) => {
    setCreateLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEvents(prev => [newEvent, ...prev]);
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
      setCreateDialog(false);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRowClick = (event: Event) => {
    setDetailView({ open: true, event });
  };

  // Helper to count active filters
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (venueTypeFilter !== 'all') count++;
    if (paidOnlyFilter) count++;
    if (publicOnlyFilter) count++;
    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setVenueTypeFilter('all');
    setPaidOnlyFilter(false);
    setPublicOnlyFilter(false);
    
    setEvents(dummyData.data.events);
    setPagination(prev => ({
      ...prev,
      total: dummyData.data.events.length,
    }));
    setFilterDrawerOpen(false);
    setFilterLoading(false);
  };

  const handleApplyFilters = async () => {
    setFilterLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = dummyData.data.events;

      if (statusFilter !== 'all') {
        filteredData = filteredData.filter(event => event.status === statusFilter);
      }

      if (venueTypeFilter !== 'all') {
        filteredData = filteredData.filter(event => event.venue.type === venueTypeFilter);
      }

      if (paidOnlyFilter) {
        filteredData = filteredData.filter(event => event.isPaidEvent);
      }

      if (publicOnlyFilter) {
        filteredData = filteredData.filter(event => event.is_public);
      }

      if (searchQuery) {
        filteredData = filteredData.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setEvents(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
      setFilterDrawerOpen(false);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setFilterLoading(false);
    }
  };

  const MENU_OPTIONS: MenuOption[] = [
    // {
    //   label: 'View',
    //   action: (event) => setDetailView({ open: true, event }),
    //   icon: <Eye className="w-4 h-4" />,
    // },
    {
      label: 'Edit',
      action: handleEdit,
      icon: <Edit className="w-4 h-4" />,
    },
    {
      label: 'Delete',
      action: handleDelete,
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'destructive',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: 'Published', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      draft: { label: 'Draft', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getVenueTypeBadge = (type: string) => {
    const typeConfig = {
      physical: { label: 'Physical', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: <MapPin className="w-3 h-3 mr-1" /> },
      virtual: { label: 'Virtual', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: <Globe className="w-3 h-3 mr-1" /> },
      hybrid: { label: 'Hybrid', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400', icon: <Calendar className="w-3 h-3 mr-1" /> },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.physical;
    
    return (
      <Badge className={config.className}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  
  const TABLE_HEAD: TableHeader[] = [
    {
      key: "index",
      label: "#",
      renderData: (_row, rowIndex) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {rowIndex !== undefined ? rowIndex + 1 : "-"}.
        </span>
      ),
    },
    {
      key: "event",
      label: "Event",
      renderData: (event) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">{event.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {event.description.length > 60
                ? `${event.description.substring(0, 60)}...`
                : event.description}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {event.is_public ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                  <Globe className="w-2 h-2 mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
                  Private
                </Badge>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "venue",
      label: "Venue",
      renderData: (event) => (
        <div className="space-y-1">
          {getVenueTypeBadge(event.venue.type)}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {event.venue.type === "virtual"
              ? event.venue.platform
              : `${event.venue.city}, ${event.venue.state}`}
          </div>
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Schedule",
      renderData: (event) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-sm">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">
              {formatDateTime(event.startAt)}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            to {formatDateTime(event.endAt)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Reg. deadline: {formatDate(event.registration_deadline)}
          </div>
        </div>
      ),
    },
    {
      key: "pricing",
      label: "Pricing",
      renderData: (event) => (
        <div className="space-y-1">
          {event.isPaidEvent ? (
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(event.ticketPrice, event.currency)}
              </span>
            </div>
          ) : (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Free
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "attendees",
      label: "Attendees",
      renderData: (event) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-900 dark:text-white">{event.max_attendees}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderData: (event) => getStatusBadge(event.status),
    },
    {
      key: "created_at",
      label: "Created",
      renderData: (event) => (
        <span className="text-gray-600 dark:text-gray-400">{formatDate(event.created_at)}</span>
      ),
    },
    {
      key: "action",
      label: "",
      type: "action",
      width: "w-12",
    },
  ];

  
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and monitor all events on your platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setExportDialog(true)}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-[#0077ED] hover:bg-[#0066CC] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setFilterDrawerOpen(true)}
              variant="outline"
              className="relative border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {getAppliedFiltersCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs px-2">
                  {getAppliedFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <CustomTable
        data={events}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={MENU_OPTIONS}
        custom_pagination={{
          total_count: pagination.total,
          rows_per_page: pagination.limit,
          page: pagination.page,
          handleChangePage,
          onRowsPerPageChange,
        }}
        pageCount={pagination.limit}
        totalPages={totalPages}
        handleChangePages={handleChangePage}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="No events found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, event: null })}
        title="Delete Event"
        content={`Are you sure you want to delete "${deleteDialog.event?.title}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Event Dialog */}
      <EventEditDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, event: null })}
        event={editDialog.event}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Event Dialog */}
      <EventCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleCreate}
        loading={createLoading}
      />

      {/* Event Detail View */}
      {detailView.open && detailView.event && (
        <EventDetailView
          event={detailView.event}
          onClose={() => setDetailView({ open: false, event: null })}
        />
      )}

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="events"
        title="Events"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Events"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
      >
        <EventFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          venueTypeFilter={venueTypeFilter}
          setVenueTypeFilter={setVenueTypeFilter}
          paidOnlyFilter={paidOnlyFilter}
          setPaidOnlyFilter={setPaidOnlyFilter}
          publicOnlyFilter={publicOnlyFilter}
          setPublicOnlyFilter={setPublicOnlyFilter}
        />
      </CustomDrawer>
    </div>
  );
};

export default EventsPageClient;