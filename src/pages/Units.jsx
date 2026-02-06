import { useState } from 'react';
import { useUnits } from '../hooks/useUnits';
import { useProjects } from '../hooks/useProjects';
import { useRent } from '../hooks/useRent';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import AddUnitModal from '../components/units/AddUnitModal';
import MarkAsRentedModal from '../components/units/MarkAsRentedModal';
import MarkAsPaidModal from '../components/units/MarkAsPaidModal';
import MarkAsSoldModal from '../components/units/MarkAsSoldModal';
import ViewOwnerModal from '../components/units/ViewOwnerModal';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import ActionMenu from '../components/common/ActionMenu';
import { UNIT_STATUS, STATUS_COLORS } from '../constants/unitStatus';
import {
    DoorOpen, User, IndianRupee, MoreVertical, Edit2,
    Trash2, CheckCircle, XCircle, AlertCircle, Clock, Phone, Eye
} from 'lucide-react';

export default function Units() {
    const { units, loading, addUnit, updateUnitStatus, updateUnit, deleteUnit } = useUnits();
    const { projects } = useProjects();
    const { markRentPaid, markRentUnpaid } = useRent();
    const { isDemo } = useAuth();

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Action State
    const [rentModalUnit, setRentModalUnit] = useState(null);
    const [payRentUnit, setPayRentUnit] = useState(null);
    const [soldModalUnit, setSoldModalUnit] = useState(null);
    const [viewOwnerUnit, setViewOwnerUnit] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [editFormData, setEditFormData] = useState({ unitNumber: '' });
    const [submitting, setSubmitting] = useState(false);

    // Filter State
    const [filterProject, setFilterProject] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const filteredUnits = units.filter(unit => {
        const matchProject = filterProject === 'ALL' || unit.projectId === filterProject;
        const matchStatus = filterStatus === 'ALL' || unit.status === filterStatus;
        return matchProject && matchStatus;
    });

    const getProjectName = (id) => projects.find(p => p.id === id)?.name || 'Unknown Project';

    // --- Actions ---

    const handleMarkAsRented = async (data) => {
        if (!rentModalUnit) return;
        await updateUnitStatus(rentModalUnit.id, UNIT_STATUS.RENTED, {
            tenant: data,
            rentStatus: 'UNPAID' // Default to unpaid initially
        });
        setRentModalUnit(null);
    };

    const confirmMarkAsSold = async (ownerDetails) => {
        if (!soldModalUnit) return;
        await updateUnitStatus(soldModalUnit.id, UNIT_STATUS.SOLD, {
            ownerDetails
        });
        setSoldModalUnit(null);
    };

    const handleMarkAsVacant = async (unit) => {
        if (confirm(`Mark Unit ${unit.unitNumber} as VACANT? This will remove tenant data.`)) {
            await updateUnitStatus(unit.id, UNIT_STATUS.VACANT, { tenant: null, rentStatus: null });
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await updateUnit(selectedUnit.id, editFormData);
            closeModals();
        } catch (error) {
            console.error("Failed to update unit:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setSubmitting(true);
        try {
            await deleteUnit(selectedUnit.id);
            closeModals();
        } catch (error) {
            console.error("Failed to delete unit:", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Rent Payments
    const handlePayRent = async (data) => {
        if (!payRentUnit) return;
        await markRentPaid(payRentUnit.id, {
            ...data,
            unitNumber: payRentUnit.unitNumber,
            tenantName: payRentUnit.tenant.tenantName
        });
    };

    const handleUnpayRent = async (unit) => {
        if (confirm(`Mark rent for Unit ${unit.unitNumber} as UNPAID?`)) {
            await markRentUnpaid(unit.id);
        }
    };

    // Helper Action Methods
    const openEditModal = (unit) => {
        setSelectedUnit(unit);
        setEditFormData({ unitNumber: unit.unitNumber });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (unit) => {
        setSelectedUnit(unit);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedUnit(null);
    };

    if (loading) return <div>Loading units...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Units Management</h1>
                <Button onClick={() => {
                    if (isDemo) {
                        alert("Demo Mode: Adding units is disabled.");
                        return;
                    }
                    setIsAddModalOpen(true);
                }}>
                    + Add Unit
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-200">
                <div className="relative">
                    <select
                        className="border rounded-lg pl-3 pr-8 py-2 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                    >
                        <option value="ALL">All Projects</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                <div className="relative">
                    <select
                        className="border rounded-lg pl-3 pr-8 py-2 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Vacant">Vacant</option>
                        <option value="Rented">Rented</option>
                        <option value="Sold">Sold</option>
                    </select>
                </div>
            </div>

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUnits.map((unit) => (
                    <div key={unit.id} className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative">
                        {/* Kebab Menu */}
                        <div className="absolute top-4 right-4 z-10">
                            <ActionMenu>
                                <button
                                    onClick={() => {
                                        if (isDemo) {
                                            alert("Demo Mode: Editing units is disabled.");
                                            return;
                                        }
                                        openEditModal(unit);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit2 size={14} /> Edit Unit
                                </button>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button
                                    onClick={() => {
                                        if (isDemo) {
                                            alert("Demo Mode: Deleting units is disabled.");
                                            return;
                                        }
                                        openDeleteModal(unit);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </ActionMenu>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    {unit.unitNumber}
                                    {unit.status === UNIT_STATUS.RENTED && (
                                        <>
                                            {unit.rentStatus === 'PAID' ? (
                                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-200">
                                                    <CheckCircle size={10} /> Paid
                                                </span>
                                            ) : (
                                                <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-orange-200">
                                                    <Clock size={10} /> Unpaid
                                                </span>
                                            )}
                                        </>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">{getProjectName(unit.projectId)}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[unit.status]}`}>
                                {unit.status}
                            </span>
                        </div>

                        {unit.status === UNIT_STATUS.RENTED && unit.tenant && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2 text-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User size={14} className="text-blue-500" />
                                    <span className="font-medium">{unit.tenant.tenantName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <IndianRupee size={14} className="text-green-500" />
                                    <span>₹{Number(unit.tenant.monthlyRent).toLocaleString('en-IN')}/mo</span>
                                </div>
                                <div className="text-xs text-gray-500 pl-6 flex justify-between">
                                    <span>Due Day: {unit.tenant.rentDueDay}th</span>
                                </div>
                            </div>
                        )}

                        {unit.status === UNIT_STATUS.SOLD && unit.ownerDetails && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg space-y-2 text-sm border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-900">
                                    <User size={14} className="text-blue-600" />
                                    <span className="font-medium">Sold to: {unit.ownerDetails.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-800">
                                    <Phone size={14} className="text-blue-600" />
                                    <span>{unit.ownerDetails.phone}</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap gap-2">
                            {unit.status === UNIT_STATUS.VACANT && (
                                <>
                                    <button
                                        onClick={() => {
                                            if (isDemo) {
                                                alert("Demo Mode: Marking as rented is disabled.");
                                                return;
                                            }
                                            setRentModalUnit(unit);
                                        }}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                                    >
                                        Mark Rented
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (isDemo) {
                                                alert("Demo Mode: Marking as sold is disabled.");
                                                return;
                                            }
                                            setSoldModalUnit(unit);
                                        }}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                                    >
                                        Mark Sold
                                    </button>
                                </>
                            )}

                            {unit.status === UNIT_STATUS.RENTED && (
                                <>
                                    {unit.rentStatus === 'PAID' ? (
                                        <button
                                            onClick={() => {
                                                if (isDemo) {
                                                    alert("Demo Mode: Marking as unpaid is disabled.");
                                                    return;
                                                }
                                                handleUnpayRent(unit);
                                            }}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <XCircle size={14} /> Mark Unpaid
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (isDemo) {
                                                    alert("Demo Mode: Marking as paid is disabled.");
                                                    return;
                                                }
                                                setPayRentUnit(unit);
                                            }}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle size={14} /> Mark Paid
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            if (isDemo) {
                                                alert("Demo Mode: Vacating unit is disabled.");
                                                return;
                                            }
                                            handleMarkAsVacant(unit);
                                        }}
                                        className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                                    >
                                        Vacate
                                    </button>
                                </>
                            )}

                            {unit.status === UNIT_STATUS.SOLD && (
                                <button
                                    onClick={() => setViewOwnerUnit(unit)}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                                >
                                    <Eye size={16} /> View Owner Details
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredUnits.length === 0 && (
                    <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                        <DoorOpen className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                        <p>No units match your filters.</p>
                    </div>
                )}
            </div>

            {/* ADD UNIT MODAL */}
            <AddUnitModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addUnit}
            />

            {/* RENT INTAKE MODAL */}
            {rentModalUnit && (
                <MarkAsRentedModal
                    isOpen={true}
                    unitNumber={rentModalUnit.unitNumber}
                    onClose={() => setRentModalUnit(null)}
                    onConfirm={handleMarkAsRented}
                />
            )}

            {/* MARK SOLD MODAL */}
            {soldModalUnit && (
                <MarkAsSoldModal
                    isOpen={true}
                    unitNumber={soldModalUnit.unitNumber}
                    onClose={() => setSoldModalUnit(null)}
                    onConfirm={confirmMarkAsSold}
                />
            )}

            {/* VIEW OWNER MODAL */}
            {viewOwnerUnit && (
                <ViewOwnerModal
                    isOpen={true}
                    unitNumber={viewOwnerUnit.unitNumber}
                    ownerDetails={viewOwnerUnit.ownerDetails}
                    onClose={() => setViewOwnerUnit(null)}
                />
            )}

            {/* MARK PAY MODAL */}
            {payRentUnit && (
                <MarkAsPaidModal
                    isOpen={true}
                    onClose={() => setPayRentUnit(null)}
                    onConfirm={handlePayRent}
                    rentData={{
                        unitNumber: payRentUnit.unitNumber,
                        tenantName: payRentUnit.tenant?.tenantName,
                        amount: payRentUnit.tenant?.monthlyRent,
                        projectName: getProjectName(payRentUnit.projectId)
                    }}
                />
            )}

            {/* EDIT MODAL */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeModals}
                title="Edit Unit"
            >
                <form onSubmit={handleEdit} className="space-y-4">
                    <Input
                        label="Unit Number"
                        value={editFormData.unitNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, unitNumber: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={closeModals} type="button">Cancel</Button>
                        <Button type="submit" loading={submitting}>Save Changes</Button>
                    </div>
                </form>
            </Modal>

            {/* DELETE MODAL */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={closeModals}
                title="Delete Unit?"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <div className="text-sm">
                            <p className="font-semibold mb-1">Warning: This action cannot be undone easily.</p>
                            <p>Unit <strong>{selectedUnit?.unitNumber}</strong> will be removed from your lists. Financial history will be preserved.</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={closeModals}>Cancel</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleDelete}
                            loading={submitting}
                        >
                            Yes, Delete Unit
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
