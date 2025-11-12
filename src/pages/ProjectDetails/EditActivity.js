import React, { useState, useEffect, useMemo, useContext } from 'react';
import { NotebookPen, MapPin, Edit, Eye, Trash2, FileCode2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import isAuth from '../../../components/isAuth';
import { Api } from '@/services/service';
import Table from '../../../components/table';
import moment from 'moment';
import { ProjectDetailsContext } from '../_app';
import EditableTable from '../../../components/EditTable';

const EditActivity = (props) => {
    const router = useRouter();
    const [projectDetails, setProjectDetails] = useContext(ProjectDetailsContext);
    const [projectId, setProjectId] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [planData, setPlanData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const PlanId = router.query.PlanId;
    const [pagination, setPagination] = useState({
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: 5,
    });

    useEffect(() => {
        const stored = localStorage.getItem('projectDetails');
        if (stored) {
            const project = JSON.parse(stored);
            setProjectId(project._id);
            setProjectDetails(project);
        }
    }, []);


    useEffect(() => {
        const delay = setTimeout(() => {
            if (PlanId) getPlanById(PlanId);
        }, 400);
        return () => clearTimeout(delay);
    }, []);


    const getPlanById = async (id) => {
        props.loader(true);

        let url = `workplan/getPlanById/${id}`;
        Api('get', url, '', router)
            .then((res) => {
                props.loader(false);
                if (res?.status === true) {
                    setPlanData(res?.data?.data || []);
                } else {
                    toast.error(res?.message || 'Failed to fetch work plans');
                }
            })
            .catch((err) => {
                props.loader(false);
                toast.error(err?.message || 'An error occurred');
            });
    };

    return (
        <div className="h-screen bg-black text-white">
            <div className="w-full h-[90vh] overflow-y-scroll scrollbar-hide pb-28 md:p-6 p-4 md:px-8 mx-auto">
                <div className="bg-custom-green py-6 px-6 flex flex-col md:flex-row gap-4 items-center justify-between rounded-[16px]">
                    <div>
                        <h1 className="text-white flex items-center md:gap-2 gap-16 text-sm md:text-base font-bold">
                            {projectDetails?.projectName}
                            <span className="ms-4 text-[11px] flex items-center gap-1">
                                <MapPin size={14} /> {projectDetails?.location}
                            </span>
                        </h1>
                        <p className="md:text-[28px] text-[22px] text-white mt-1 font-semibold">
                            {planData.planName}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-custom-yellow py-1.5 px-3 text-black gap-1 rounded-[12px] flex items-center hover:bg-yellow-400 cursor-pointer"
                    >
                        <NotebookPen size={18} />
                        Save Changes
                    </button>
                </div>

                <EditableTable
                    planId={PlanId}
                    loader={props.loader} />
            </div>
        </div>
    );
};

export default isAuth(EditActivity);
