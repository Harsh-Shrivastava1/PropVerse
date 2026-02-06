import { useState, useMemo } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useUnits } from '../hooks/useUnits';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ActionMenu from '../components/common/ActionMenu';
import {
    Building2, MapPin, Calendar, Search, Filter,
    MoreVertical, Edit2, Trash2, ArrowRight, Store,
    Users, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

export default function Projects() {
    const { projects, loading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();
    const { units, loading: unitsLoading } = useUnits();
    const navigate = useNavigate();

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form / Action State
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({ name: '', location: '' });

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    // --- Actions ---

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addProject(formData);
            closeModals();
        } catch (error) {
            console.error("Failed to create project:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedProject) return;
        setSubmitting(true);
        try {
            await updateProject(selectedProject.id, formData);
            closeModals();
        } catch (error) {
            console.error("Failed to update project:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProject) return;
        setSubmitting(true);
        try {
            await deleteProject(selectedProject.id);
            closeModals();
        } catch (error) {
            console.error("Failed to delete project:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (project) => {
        setSelectedProject(project);
        setFormData({ name: project.name, location: project.location });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (project) => {
        setSelectedProject(project);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setFormData({ name: '', location: '' });
        setSelectedProject(null);
    };

    // --- Computed Data ---

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLocation = locationFilter ? p.location === locationFilter : true;
            return matchesSearch && matchesLocation;
        });
    }, [projects, searchQuery, locationFilter]);

    const uniqueLocations = useMemo(() => {
        const locs = projects.map(p => p.location).filter(Boolean);
        return [...new Set(locs)];
    }, [projects]);

    const getProjectStats = (projectId) => {
        const projectUnits = units.filter(u => u.projectId === projectId);
        return {
            total: projectUnits.length,
            rented: projectUnits.filter(u => u.status === 'Rented').length,
            vacant: projectUnits.filter(u => u.status === 'Vacant').length,
            sold: projectUnits.filter(u => u.status === 'Sold').length,
        };
    };

    if (projectsLoading || unitsLoading) {
        return <ProjectsSkeleton />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-500 text-sm">Manage your properties and view performance stats.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    + Add Project
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        <MapPin size={16} />
                    </div>
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all cursor-pointer"
                    >
                        <option value="">All Locations</option>
                        {uniqueLocations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                    const stats = getProjectStats(project.id);
                    return (
                        <div key={project.id} className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
                            {/* Kebab Menu */}
                            <div className="absolute top-4 right-4 z-10">
                                <ActionMenu>
                                    <button
                                        onClick={() => openEditModal(project)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit2 size={14} /> Edit Project
                                    </button>
                                    <button
                                        onClick={() => navigate(`/units?projectId=${project.id}`)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Store size={14} /> View Units
                                    </button>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button
                                        onClick={() => openDeleteModal(project)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </ActionMenu>
                            </div>

                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <Link to={`/units?projectId=${project.id}`} className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <Building2 size={24} />
                                </Link>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                <Link to={`/units?projectId=${project.id}`}>
                                    {project.name}
                                </Link>
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    <span>{project.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{project.createdAt?.toDate ? format(project.createdAt.toDate(), 'MMM d, yyyy') : 'Just now'}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-auto grid grid-cols-4 gap-2 border-t pt-4">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-0.5">Total</p>
                                    <p className="font-bold text-gray-900 bg-gray-50 rounded px-1">{stats.total}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-green-600 mb-0.5">Rented</p>
                                    <p className="font-bold text-gray-900 bg-green-50 rounded px-1">{stats.rented}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-orange-600 mb-0.5">Vacant</p>
                                    <p className="font-bold text-gray-900 bg-orange-50 rounded px-1">{stats.vacant}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-blue-600 mb-0.5">Sold</p>
                                    <p className="font-bold text-gray-900 bg-blue-50 rounded px-1">{stats.sold}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredProjects.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-200 border-dashed">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
                            <Search size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No projects found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">
                            {searchQuery || locationFilter ? "Try adjusting your filters or search terms." : "Get started by creating your first real estate project."}
                        </p>
                        {!searchQuery && !locationFilter && (
                            <Button className="mt-6" onClick={() => setIsCreateModalOpen(true)}>
                                Create Project
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={closeModals}
                title="Create New Project"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input
                        label="Project Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="e.g. Skyline Towers"
                    />
                    <Input
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        placeholder="e.g. Mumbai, India"
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={closeModals} type="button">Cancel</Button>
                        <Button type="submit" loading={submitting}>Create Project</Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeModals}
                title="Edit Project"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <Input
                        label="Project Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={closeModals} type="button">Cancel</Button>
                        <Button type="submit" loading={submitting}>Save Changes</Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeModals}
                title="Delete Project?"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <div className="text-sm">
                            <p className="font-semibold mb-1">Warning: This action cannot be undone easily.</p>
                            <p>The project <strong>{selectedProject?.name}</strong> will be hidden from your dashboard. Associated units will NOT be deleted but will be archived.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={closeModals}>Cancel</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleDelete}
                            loading={submitting}
                        >
                            Yes, Delete Project
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function ProjectsSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between">
                <div className="h-8 w-48 bg-gray-200 rounded"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-14 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
        </div>
    );
}
