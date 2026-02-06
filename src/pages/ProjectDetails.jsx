import { useParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useUnits } from '../hooks/useUnits';
import { Building2, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectDetails() {
    const { projectId } = useParams();
    const { projects } = useProjects();
    const { units } = useUnits(projectId);

    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return <div className="p-8 text-center text-gray-500">Project not found or loading...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-6">
                <Link to="/projects" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <MapPin size={14} />
                        <span>{project.location}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Project Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500 block mb-1">Total Units</span>
                        <span className="text-2xl font-bold text-gray-900">{project.totalUnits}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500 block mb-1">Active Units</span>
                        <span className="text-2xl font-bold text-gray-900">{units.length}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500 block mb-1">Created On</span>
                        <span className="text-lg font-bold text-gray-900">
                            {project.createdAt?.toDate ? project.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Units</h2>
                {units.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {units.map(unit => (
                            <div key={unit.id} className="p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-gray-900">Unit {unit.unitNumber}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${unit.status === 'Rented' ? 'bg-green-100 text-green-700' :
                                            unit.status === 'Sold' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {unit.status}
                                    </span>
                                    <span className="text-sm text-gray-500">{unit.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No units added yet.</p>
                )}
            </div>
        </div>
    );
}
