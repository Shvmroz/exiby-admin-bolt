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
import { useSnackbar } from 'notistack';

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

const EventsPageClient: React.FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [rowData, setRowData] = useState<Event | null>(null);
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

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [venueTypeFilter, setVenueTypeFilter] = useState('all');
  const [paidOnlyFilter, setPaidOnlyFilter] = useState(false);
  const [publicOnlyFilter, setPublicOnlyFilter] = useState(false);
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Local pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersApplied, setFiltersApplied] = useState({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
    limit: 50,
  });

  // Table helpers
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Load events
  const getListEvents = async (searchQuery = '', filters = {}) => {
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const result = await _events_list_api(currentPage, rowsPerPage, searchQuery, filters);
      
      // Simulate API response structure
      const result = {
        code: 200,
        data: {
          events: [],
          total_count: 0,
          total_pages: 1,
          filters_applied: filters,
        }
      };

      if (result?.code === 200) {
        setEvents(result.data.events || []);
        setTotalCount(result.data.total_count || 0);
        setTotalPages(result.data.total_pages || 1);
        setFiltersApplied(result.data.filters_applied || {});
      } else {
        enqueueSnackbar(result?.message || 'Failed to load events', {
          variant: 'error',
        });
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListEvents();
  }, [currentPage, rowsPerPage]);

  if (loading && events.length === 0) {
    return <TableSkeleton rows={8} columns={7} showFilters={true} />;
  }

  const handleEdit = (event: Event) => {
    setEditDialog({ open: true, event });
    setRowData(event);
  };

  const handleDelete = (event: Event) => {
    setDeleteDialog({ open: true, event });
    setRowData(event);
  };

  const handleConfirmDelete = async () => {
    if (!rowData?._id) return;

    setDeleteLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _delete_event_api(rowData._id);
      
      // Simulate API response
      const result = { code: 200, message: 'Event deleted successfully' };

      if (result?.code === 200) {
        setEvents(prev => 
          prev.filter(event => event._id !== rowData._id)
        );
        setDeleteDialog({ open: false, event: null });
        setRowData(null);
        enqueueSnackbar('Event deleted successfully', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(result?.message || 'Failed to delete event', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (data: Partial<Event>) => {
    if (!rowData?._id) return;
    
    setEditLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _edit_event_api(rowData._id, data);
      
      // Simulate API response
      const result = { 
        code: 200, 
        message: 'Event updated successfully',
        data: { ...rowData, ...data }
      };

      if (result?.code === 200) {
        setEditDialog({ open: false, event: null });
        setRowData(null);
        setEvents(prev =>
          prev.map(event => event._id === rowData._id ? { ...event, ...data } : event)
        );
        enqueueSnackbar('Event updated successfully', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(result?.message || 'Failed to update event', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddNewEvent = async (data: Partial<Event>) => {
    setAddLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _add_event_api(data);
      
      // Simulate API response
      const result = {
        code: 200,
        message: 'Event created successfully',
        data: { _id: `event_${Date.now()}`, ...data }
      };

      if (result?.code === 200) {
        setEvents(prev => [result.data, ...prev]);
        setCreateDialog(false);
        enqueueSnackbar('Event created successfully', {
          variant: 'success',
        });
      } else {
        enqueueSnackbar(result?.message || 'Failed to create event', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    } finally {
      setAddLoading(false);
    }
  };

  const handleRowClick = (event: Event) => {
    setDetailView({ open: true, event });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getListEvents(searchQuery);
  };

  // Filter functions
  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (venueTypeFilter !== 'all') count++;
    if (paidOnlyFilter) count++;
    if (publicOnlyFilter) count++;
    if (createdFrom) count++;
    if (createdTo) count++;
    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setVenueTypeFilter('all');
    setPaidOnlyFilter(false);
    setPublicOnlyFilter(false);
    setCreatedFrom('');
    setCreatedTo('');
    setFilterDrawerOpen(false);
    getListEvents();
  };

  const handleApplyFilters = () => {
    const filters: { [key: string]: string } = {};

    if (statusFilter !== 'all') filters.status = statusFilter;
    if (venueTypeFilter !== 'all') filters.venue_type = venueTypeFilter;
    if (paidOnlyFilter) filters.paid_only = 'true';
    if (publicOnlyFilter) filters.public_only = 'true';
    if (createdFrom) filters.created_from = createdFrom;
    if (createdTo) filters.created_to = createdTo;

    getListEvents(searchQuery, filters);
    setFilterDrawerOpen(false);
  };

  const MENU_OPTIONS: MenuOption[] = [
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

  const handleSearch = () => {
    setCurrentPage(1);
    getListEvents(searchQuery);
  };

  const MENU_OPTIONS: MenuOption[] = [
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
            <div className="relative w-full flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-24"
                />
              </div>
              {filtersApplied?.search && filtersApplied.search !== '' ? (
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    getListEvents('');
                  }}
                  variant="outline"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Clear
                </Button>
              ) : (
                <Button
                  onClick={handleSearch}
                  disabled={searchQuery === ''}
                  variant="outline"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Search
                </Button>
              )}
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
          total_count: totalCount,
          rows_per_page: rowsPerPage,
          page: currentPage,
          handleChangePage,
          onRowsPerPageChange,
        }}
        totalPages={totalPages}
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
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Edit Event Dialog */}
      <EventEditDialog
        open={editDialog.open}
        onOpenChange={(open) => {
          setEditDialog({ open, event: null });
          if (!open) setRowData(null);
        }}
        event={rowData}
        onSave={handleSaveEdit}
        loading={editLoading}
      />

      {/* Create Event Dialog */}
      <EventCreateDialog
        open={createDialog}
        onOpenChange={setCreateDialog}
        onSave={handleAddNewEvent}
        loading={addLoading}
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
        applyButtonDisabled={isDateRangeInvalid}
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