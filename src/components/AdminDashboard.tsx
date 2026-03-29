import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  LogOut,
  Shield,
  Phone,
  Globe,
  User,
  Camera,
  MessageSquare,
  Trash2,
  Video
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase, makeServerRequest } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './ui/pagination';

interface AdminDashboardProps {
  accessToken: string; // Kept for interface compatibility
  onLogout: () => void;
}

interface Application {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  ethnicity: string;
  countryOfResidence: string;
  whatsAppNumber: string;
  currentlyInUAE: string;
  currentCountry: string;
  residenceTel: string;
  mobileUAE: string;
  primaryLanguage: string;
  otherLanguages: string;
  role: string;
  roleComment: string;
  showreelURL: string;
  instagramURL: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  adminNotes?: string;
  imageUrls?: string[];
  signedImageUrls?: string[];
  castingVideoUrl?: string;
  signedCastingVideoUrl?: string;
  catalog?: string;
  subcategory?: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [migrationMessage, setMigrationMessage] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []); // Fetch on mount

  useEffect(() => {
    filterApplications();
    setCurrentPage(1); // Reset to first page when filters change
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setFetchError(null);
      setLoading(true);
      // Always use SQL database
      const endpoint = '/admin/applications?source=sql';

      const result = await makeServerRequest(endpoint, {}, true);

      if (result.success) {
        setApplications(result.applications);
        setStats(result.stats);
      } else {
        console.error('Failed to fetch applications:', result.message);
        setFetchError(`Server error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setFetchError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const syncApprovedToTalents = async () => {
    if (!confirm('This will publish all approved applications to the website. Proceed?')) return;

    setMigrationStatus('running');
    setMigrationMessage('Syncing approved applications to talents table...');

    try {
      const result = await makeServerRequest('/admin/sync-approved-to-talents', {
        method: 'POST',
      }, true);

      if (result.success) {
        setMigrationStatus('success');
        setMigrationMessage(`✅ Success! ${result.stats.synced} approved models are now on the website!`);
        setTimeout(() => {
          setMigrationStatus('idle');
        }, 3000);
      } else {
        setMigrationStatus('error');
        setMigrationMessage(result.message || 'Sync failed');
        setTimeout(() => setMigrationStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Sync error:', error);
      setMigrationStatus('error');
      setMigrationMessage('Failed to sync. Please try again.');
      setTimeout(() => setMigrationStatus('idle'), 5000);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by submission date (newest first)
    filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    setFilteredApplications(filtered);
  };

  const handleApprove = async (applicationId: string) => {
    setActionLoading(true);
    try {
      // Always use SQL
      const endpoint = `/admin/applications/${applicationId}/approve?source=sql`;
      
      const result = await makeServerRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ notes: actionNotes }),
      }, true);

      if (result.success) {
        await fetchApplications();
        setSelectedApplication(null);
        setActionNotes('');
      } else {
        console.error('Failed to approve application:', result.message);
        alert(`Failed to approve: ${result.message}`);
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Error approving application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (applicationId: string) => {
    setActionLoading(true);
    try {
      // Always use SQL
      const endpoint = `/admin/applications/${applicationId}/reject?source=sql`;
      
      const result = await makeServerRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ notes: actionNotes }),
      }, true);

      if (result.success) {
        await fetchApplications();
        setSelectedApplication(null);
        setActionNotes('');
      } else {
        console.error('Failed to reject application:', result.message);
        alert(`Failed to reject: ${result.message}`);
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Error rejecting application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (applicationId: string) => {
    setDeleteLoading(true);
    try {
      // Always use SQL
      const endpoint = `/admin/applications/${applicationId}?source=sql`;
      
      const result = await makeServerRequest(endpoint, {
        method: 'DELETE',
      }, true);

      if (result.success) {
        await fetchApplications();
        setDeleteConfirmId(null);
        setSelectedApplication(null);
      } else {
        console.error('Failed to delete application:', result.message);
        alert('Failed to delete application. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Error deleting application. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
  const showPagination = filteredApplications.length > itemsPerPage;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
              isActive={currentPage === i}
              size="icon"
              className={`cursor-pointer ${currentPage === i ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-white hover:bg-white/10'}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={(e) => { e.preventDefault(); handlePageChange(1); }}
            isActive={currentPage === 1}
            size="icon"
            className={`cursor-pointer ${currentPage === 1 ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-white hover:bg-white/10'}`}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" className="text-white/60" />);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={(e) => { e.preventDefault(); handlePageChange(i); }}
              isActive={currentPage === i}
              size="icon"
              className={`cursor-pointer ${currentPage === i ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-white hover:bg-white/10'}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" className="text-white/60" />);
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}
            isActive={currentPage === totalPages}
            size="icon"
            className={`cursor-pointer ${currentPage === totalPages ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'text-white hover:bg-white/10'}`}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl text-white truncate">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-white/60 truncate">Faizaan Events Models</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* SQL Database Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">SQL Active</span>
              </div>

              {stats.approved > 0 && (
                <Button
                  onClick={syncApprovedToTalents}
                  disabled={migrationStatus === 'running'}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3"
                  size="sm"
                >
                  {migrationStatus === 'running' ? 'Publishing...' : '✨ Publish to Website'}
                </Button>
              )}

              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white flex-shrink-0 text-xs sm:text-sm px-2 sm:px-4"
                size="sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Migration Status Message */}
        {migrationMessage && (
          <div className={`mb-6 p-4 rounded-lg border ${migrationStatus === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
            migrationStatus === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
              'bg-blue-900/20 border-blue-500/30 text-blue-400'
            }`}>
            {migrationMessage}
          </div>
        )}

        {/* Database Status */}
        <div className="mb-6 p-4 rounded-lg border bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-green-400 font-semibold mb-1 flex items-center gap-2">
                🚀 SQL Database Active
                <Badge className="bg-green-500 text-white text-xs">Fast</Badge>
              </h3>
              <p className="text-sm text-white/70 mb-2">
                Showing {stats.total} applications. New applications from "Apply Now" appear here automatically.
              </p>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                <span className="px-2 py-1 bg-white/5 rounded text-white/60">✓ Instant Loading</span>
                <span className="px-2 py-1 bg-white/5 rounded text-white/60">✓ Real-time Updates</span>
                <span className="px-2 py-1 bg-white/5 rounded text-white/60">✓ Optimized Queries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gray-900 border-white/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-white/60 truncate">Total Applications</p>
                  <p className="text-xl sm:text-2xl text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-white/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-white/60 truncate">Pending Review</p>
                  <p className="text-xl sm:text-2xl text-white">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-white/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-white/60 truncate">Approved</p>
                  <p className="text-xl sm:text-2xl text-white">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-white/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-white/60 truncate">Rejected</p>
                  <p className="text-xl sm:text-2xl text-white">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-white/20 mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 pl-9 sm:pl-10 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm flex-1 sm:flex-initial min-w-0"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Mode Notice */}
        {(projectId as string) === 'placeholder-project-id' && (
          <Card className="bg-yellow-900/20 border-yellow-500/30 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="text-yellow-400 font-medium">Demo Mode</h3>
                  <p className="text-white/70">
                    This is a demonstration of the admin panel. To enable full functionality, please configure your Supabase credentials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Notice */}
        {fetchError && (
          <Card className="bg-red-900/20 border-red-500/30 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-red-400 font-medium mb-1">Connection Error</h3>
                  <p className="text-white/70 text-sm mb-3">
                    Failed to load applications from the server: {fetchError}
                  </p>
                  <div className="space-y-2 text-sm text-white/60">
                    <p><strong>Possible causes:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Edge function "server" is not deployed or not running</li>
                      <li>Network connectivity issue</li>
                      <li>CORS configuration error</li>
                      <li>Database connection problem</li>
                    </ul>
                    <p className="mt-3"><strong>Steps to fix:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Open <code className="text-yellow-400 bg-black/30 px-1 py-0.5 rounded">/CHECK_DATABASE.html</code> in your browser to diagnose the issue</li>
                      <li>Check Edge Functions in Supabase Dashboard: <a href={`https://supabase.com/dashboard/project/${projectId}/functions`} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Open Dashboard</a></li>
                      <li>View Edge Function logs for error details</li>
                      <li>Redeploy the "server" function if needed</li>
                    </ol>
                  </div>
                  <div className="mt-4">
                    <Button onClick={fetchApplications} className="bg-red-500 hover:bg-red-600 text-white" size="sm">
                      Retry Connection
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Applications List Header */}
        {showPagination && (
          <div className="mb-4">
            <p className="text-sm text-white/60">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredApplications.length)} of {filteredApplications.length} applications (Page {currentPage} of {totalPages})
            </p>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {paginatedApplications.map((application) => (
            <Card key={application.id} className="bg-gray-900 border-white/20 hover:bg-gray-800 transition-colors">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 w-full min-w-0">
                    {/* Profile Image */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                      {application.signedImageUrls && application.signedImageUrls[0] ? (
                        <ImageWithFallback
                          src={application.signedImageUrls[0]}
                          alt={`${application.firstName} ${application.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white/40" />
                        </div>
                      )}
                    </div>

                    {/* Application Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-sm sm:text-base md:text-lg text-white truncate">
                          {application.firstName} {application.lastName}
                        </h3>
                        <Badge className={`w-fit text-xs ${application.status === 'pending' ? 'bg-yellow-500 text-black' :
                          application.status === 'approved' ? 'bg-green-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                        <div className="truncate">
                          <p className="text-white/60">Category:</p>
                          <p className="text-white truncate">
                            {application.catalog && application.subcategory
                              ? `${application.catalog} / ${application.subcategory}`
                              : application.role || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60">Age:</p>
                          <p className="text-white">{calculateAge(application.dateOfBirth)} years</p>
                        </div>
                        <div className="truncate">
                          <p className="text-white/60">Nationality:</p>
                          <p className="text-white truncate">{application.nationality}</p>
                        </div>
                        <div className="truncate sm:col-span-2 lg:col-span-1">
                          <p className="text-white/60">Email:</p>
                          <p className="text-white truncate">{application.email}</p>
                        </div>
                        <div className="truncate">
                          <p className="text-white/60">Location:</p>
                          <p className="text-white truncate">{application.countryOfResidence}</p>
                        </div>
                        <div className="truncate">
                          <p className="text-white/60">Submitted:</p>
                          <p className="text-white truncate">{formatDate(application.submittedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col lg:flex-row gap-2 w-full sm:w-auto flex-wrap">
                    <Button
                      onClick={() => setSelectedApplication(application)}
                      className="bg-white/10 hover:bg-white/20 text-white flex-1 sm:flex-initial text-xs sm:text-sm"
                      size="sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                      <span className="hidden sm:inline">View</span>
                    </Button>

                    {application.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => {
                            setSelectedApplication(application);
                            setActionNotes('');
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white flex-1 sm:flex-initial text-xs sm:text-sm"
                          size="sm"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedApplication(application);
                            setActionNotes('');
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white flex-1 sm:flex-initial text-xs sm:text-sm"
                          size="sm"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                      </>
                    )}

                    <Button
                      onClick={() => setDeleteConfirmId(application.id)}
                      className="bg-red-600 hover:bg-red-700 text-white border-red-500 flex-1 sm:flex-initial text-xs sm:text-sm"
                      size="sm"
                      disabled={deleteLoading}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredApplications.length === 0 && (
            <Card className="bg-gray-900 border-white/20">
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                {applications.length === 0 ? (
                  <>
                    <p className="text-white/60 mb-2">No applications submitted yet.</p>
                    <p className="text-sm text-white/40">Applications will appear here once users submit the "Apply Now" form.</p>
                  </>
                ) : (
                  <p className="text-white/60">No applications found matching your criteria.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {showPagination && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent className="flex-wrap gap-1 sm:gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    size="default"
                    className={`cursor-pointer text-white hover:bg-white/10 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    size="default"
                    className={`cursor-pointer text-white hover:bg-white/10 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-white">
                  Application Details - {selectedApplication.firstName} {selectedApplication.lastName}
                </h2>
                <Button
                  onClick={() => setSelectedApplication(null)}
                  className="bg-white/10 hover:bg-white/20 text-white"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Images */}
              {selectedApplication.signedImageUrls && selectedApplication.signedImageUrls.length > 0 && (
                <div>
                  <h3 className="text-lg text-white mb-3 flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Portfolio Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedApplication.signedImageUrls.map((url, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src={url}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Casting Video */}
              {selectedApplication.signedCastingVideoUrl && (
                <div>
                  <h3 className="text-lg text-white mb-3 flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    Casting Video
                  </h3>
                  <div className="aspect-video overflow-hidden rounded-lg border border-white/10 relative max-w-xl mb-6">
                    <video 
                      src={selectedApplication.signedCastingVideoUrl} 
                      controls 
                      className="w-full h-full object-contain bg-black"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <h3 className="text-lg text-white mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Full Name:</p>
                    <p className="text-white">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Gender:</p>
                    <p className="text-white">{selectedApplication.gender}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Date of Birth:</p>
                    <p className="text-white">{selectedApplication.dateOfBirth} ({calculateAge(selectedApplication.dateOfBirth)} years old)</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Nationality:</p>
                    <p className="text-white">{selectedApplication.nationality}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Ethnicity:</p>
                    <p className="text-white">{selectedApplication.ethnicity}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Country of Residence:</p>
                    <p className="text-white">{selectedApplication.countryOfResidence}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg text-white mb-3 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Email:</p>
                    <p className="text-white">{selectedApplication.email}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">WhatsApp:</p>
                    <p className="text-white">{selectedApplication.whatsAppNumber}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Residence Tel:</p>
                    <p className="text-white">{selectedApplication.residenceTel}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Mobile UAE:</p>
                    <p className="text-white">{selectedApplication.mobileUAE}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Currently in UAE:</p>
                    <p className="text-white">{selectedApplication.currentlyInUAE}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Current Country:</p>
                    <p className="text-white">{selectedApplication.currentCountry}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg text-white mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Preferred Role:</p>
                    <p className="text-white">{selectedApplication.role}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white/60">Primary Language:</p>
                    <p className="text-white">{selectedApplication.primaryLanguage}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded col-span-1 md:col-span-2">
                    <p className="text-white/60">Other Languages:</p>
                    <p className="text-white">{selectedApplication.otherLanguages || 'None specified'}</p>
                  </div>
                  {selectedApplication.roleComment && (
                    <div className="p-3 bg-white/5 rounded col-span-1 md:col-span-2">
                      <p className="text-white/60">Role Comments:</p>
                      <p className="text-white">{selectedApplication.roleComment}</p>
                    </div>
                  )}
                  {selectedApplication.instagramURL && (
                    <div className="p-3 bg-white/5 rounded">
                      <p className="text-white/60">Instagram:</p>
                      <a href={selectedApplication.instagramURL} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300">
                        {selectedApplication.instagramURL}
                      </a>
                    </div>
                  )}
                  {selectedApplication.showreelURL && (
                    <div className="p-3 bg-white/5 rounded">
                      <p className="text-white/60">Showreel:</p>
                      <a href={selectedApplication.showreelURL} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300">
                        {selectedApplication.showreelURL}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              {selectedApplication.adminNotes && (
                <div>
                  <h3 className="text-lg text-white mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Admin Notes
                  </h3>
                  <div className="p-3 bg-white/5 rounded">
                    <p className="text-white">{selectedApplication.adminNotes}</p>
                  </div>
                </div>
              )}

              {/* Actions for Pending Applications */}
              {selectedApplication.status === 'pending' && (
                <div>
                  <h3 className="text-lg text-white mb-3">Take Action</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Admin Notes (Optional)</Label>
                      <Textarea
                        placeholder="Add notes about this decision..."
                        value={actionNotes}
                        onChange={(e) => setActionNotes(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="flex space-x-4 flex-wrap">
                      <Button
                        onClick={() => handleApprove(selectedApplication.id)}
                        disabled={actionLoading}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {actionLoading ? 'Approving...' : 'Approve Application'}
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedApplication.id)}
                        disabled={actionLoading}
                        className="bg-red-500 hover:bg-red-600 text-white"
                        size="sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {actionLoading ? 'Rejecting...' : 'Reject Application'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Application Option */}
              <div>
                <h3 className="text-lg text-white mb-3">Management Actions</h3>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-red-400 font-medium">Delete Application</h4>
                      <p className="text-sm text-white/60 mt-1">
                        Permanently delete this application and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button
                      onClick={() => setDeleteConfirmId(selectedApplication.id)}
                      className="bg-red-600 hover:bg-red-700 text-white border-red-500"
                      disabled={deleteLoading}
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Application
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg max-w-md w-full border border-red-500/30">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg text-white font-medium">Confirm Deletion</h3>
                  <p className="text-sm text-white/60">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-white/80 mb-6">
                Are you sure you want to permanently delete this application? All associated data, including images and personal information, will be removed from the system.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                  disabled={deleteLoading}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={deleteLoading}
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleteLoading ? 'Deleting...' : 'Delete Application'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}