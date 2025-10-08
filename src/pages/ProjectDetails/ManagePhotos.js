import React, { useState } from "react";
import { Upload, Plus, X, ChevronLeft, FolderPlus, Album, CameraOff, Cross, CrossIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ProjectPhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const router = useRouter()
    // Mock Upload Function (Random API Simulation)
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select photos first!");
            return;
        }

        // Simulating API call
        await new Promise((res) => setTimeout(res, 1000));

        const newPhotos = selectedFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            url: URL.createObjectURL(file),
        }));

        setPhotos((prev) => [...prev, ...newPhotos]);
        setSelectedFiles([]);
        setIsModalOpen(false);
        toast.success("Photos uploaded successfully!");
    };

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFiles([...e.target.files]);
    };

    return (
        <div className="h-screen bg-black text-white ">
            {/* Header */}
            <div className="w-full h-full overflow-y-scroll  scrollbar-hide overflow-scroll pb-28 md:p-6 p-4 mx-auto md:px-8">
                <div className="flex flex-col items-start justify-start mb-6 gap-2">
                    <h1 className="text-xl font-bold text-custom-yellow">Project Photos</h1>
                    <button
                        onClick={() => router.push(`/ProjectDetails/overview`)}
                        className="py-2 flex underline text-sm cursor-pointer rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} /> Go back
                    </button>
                    <div className="flex justify-start items-start gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-custom-yellow text-black px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                            Upload Photos
                            <Upload size={16} />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-custom-black text-white border border-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                        >
                            Create Album
                            <FolderPlus size={16} />
                        </button>
                    </div>
                </div>

                {/* All Photos Section */}
                <h2 className="text-sm underline mb-4">
                    All Photos ({photos.length})
                </h2>

                {photos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[70%] text-gray-400">
                        <CameraOff size={48} className="text-white" />
                        <p className="mt-2 text-white">No photos yet</p>
                        <p className="text-yellow-400 text-sm mt-1 text-center">
                            Start by uploading some photos to showcase your project progress.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-custom-yellow text-black px-4 py-2 rounded-lg mt-4 flex items-center gap-2"
                        >
                            Upload Your First Photos <Upload size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="relative bg-gray-800 rounded-lg overflow-hidden"
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.name}
                                    className="w-full h-32 object-cover"
                                />
                                <p className="text-xs p-1 text-center">{photo.name}</p>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 ">
                        <div className="bg-custom-black text-white rounded-[38px] md:p-8 p-4 w-full max-w-2xl">

                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-bold">Upload Photo</h2>
                                    <p className="text-sm text-gray-300">
                                        Upload photos from your device or select from Google Drive
                                    </p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Upload Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        placeholder="Upload from File"
                                        type="text"
                                        className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border"
                                    />
                                    <Upload className="absolute top-2 right-3" />
                                </div>
                                <div className="relative">
                                    <input
                                        placeholder="Upload from Drive"
                                        type="text"
                                        className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border"
                                    />
                                    <img
                                        src="/GoogleDrive.png"
                                        className="absolute top-2 right-3 w-6"
                                        alt="Google Drive"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <p className="text-sm text-white mb-1">Caption (Optional)</p>
                                    <input
                                        placeholder="Add a caption for your photos"
                                        type="text"
                                        className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg border"
                                    />
                                </div>
                            </div>

                            {/* Selected Photos */}
                            <div className="flex flex-col gap-2 mb-4 mt-4">
                                <p className="text-sm text-white">Selected Photos</p>
                                <div className="flex flex-wrap gap-3">
                                    {[1, 2, 3].map((i) => (

                                        <div
                                            key={i}
                                            className=" relative w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-400"
                                        >
                                            Photo {i}

                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-3 flex-wrap">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 text-sm rounded-lg bg-custom-yellow text-black hover:bg-yellow-400">
                                    Upload Photos
                                </button>
                            </div>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default ProjectPhotos;
