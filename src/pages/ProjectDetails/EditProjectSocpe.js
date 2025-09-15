import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { ProjectDetailsContext, userContext } from "../_app"
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Api } from '@/services/service';


const EditProjectScope = (props) => {
    const [content, setContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [user] = useContext(userContext)
    const [loading, setLoading] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const [projectDetails, setProjectdetails] = useContext(ProjectDetailsContext)
    const router = useRouter();

    const editorConfig = {
        height: 500,
        toolbarAdaptive: false,
        toolbarSticky: true,
        toolbarButtonSize: "middle",
        buttons: [
            "bold", "italic", "underline", "strikethrough", "|",
            "fontsize", "font", "paragraph", "brush", "|",
            "left", "center", "right", "justify", "|",
            "ul", "ol", "indent", "outdent", "|",
            "link", "image", "video", "table", "hr", "emoji", "|",
            "undo", "redo", "|",
            "cut", "copy", "paste", "|",
            "brush", "background", "|",
            "source", "fullsize"
        ],
        uploader: {
            insertImageAsBase64URI: true,
        },
        removeButtons: ["about"],
    };

    const handleGoBack = () => {
        router.push("/ProjectDetails/overview")
    };

    useEffect(() => {
        const stored = localStorage.getItem("projectDetails")
        if (stored) {
            const project = JSON.parse(stored)
            setProjectdetails(project)
            setProjectId(project._id)
            setContent(project?.ProjectScope)
        }
    }, [])

    const handleSaveChanges = async () => {
        if (!content.trim()) {
            toast.error('Please add some content before saving.');
            return;
        }

        if (!projectId) {
            toast.error("Project ID not found");
            return;
        }

        setLoading(true);
        props.loader(true);

        const data = {
            ProjectScope: content,
            userId: user._id,
        };

        Api("put", `project/updateProject/${projectId}`, data, router)
            .then((res) => {
                setLoading(false);
                props.loader(false);

                if (res?.status === true) {
                    toast.success("Project updated successfully");
                    const updatedProject = res?.data?.data;
                    if (updatedProject) {
                        localStorage.setItem("projectDetails", JSON.stringify(updatedProject));
                    }
                    router.push(`/ProjectDetails/overview`);
                } else {
                    toast.error(res?.message || "Failed to update project");
                }
            })
            .catch((err) => {
                setLoading(false);
                props.loader(false);
                toast.error(err?.message || "An error occurred");
            });
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    return (
        <div className="h-screen bg-black text-white">
            <div className="w-full h-full md:p-6 mx-auto p-4 md:px-8 overflow-y-scroll  scrollbar-hide overflow-scroll pb-28">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-custom-yellow flex items-center gap-2">
                        Edit Project Scope
                    </h1>
                </div>

                {/* Go Back Button */}
                <button
                    onClick={handleGoBack}
                    className="py-2 flex items-center underline text-sm cursor-pointer rounded-lg transition-colors pb-6 text-white hover:text-[#e0f349]"
                >
                    <ChevronLeft size={20} /> Go Back
                </button>

                {/* Edit Scope Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Edit Scope</h2>
                            <p className="text-gray-400 text-sm">
                                Use the rich text editor to format your project scope with lists, bold text, and other formatting options.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={togglePreview}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={loading}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${loading
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-custom-yellow hover:bg-[#e0f349] text-black font-medium'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Editor Container */}
                    <div className="text-black rounded-lg p-1">
                        {showPreview ? (
                            <div className="bg-white p-6 rounded-lg min-h-[400px]">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
                                <div
                                    className="text-gray-800 prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500">No content to preview...</p>' }}
                                />
                            </div>
                        ) : (
                            <div className='text-black'>
                                <JoditEditor
                                    value={content}
                                    config={editorConfig}
                                    onChange={(newContent) => setContent(newContent)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center text-gray-400 text-sm">
                    <p>Use the toolbar above to format your text with bold, italic, lists, links, and more.</p>
                    <p className="mt-1">Your changes are automatically saved as you type.</p>
                </div>
            </div>
        </div>
    );
};

export default EditProjectScope;