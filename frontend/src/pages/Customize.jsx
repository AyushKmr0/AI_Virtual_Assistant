import React, { useContext, useRef, useState } from "react";
import Card from "../components/Card";
import img1 from "../assets/image1.avif";
import img2 from "../assets/image2.jpg";
import img3 from "../assets/image3.jpg";
import img4 from "../assets/image4.png";
import img5 from "../assets/image5.avif";
import img6 from "../assets/image6.jpg";
import img7 from "../assets/image7.jpg";
import img8 from "../assets/image8.webp";
import { PiPlus } from "react-icons/pi";
import { FaDeleteLeft } from "react-icons/fa6";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIos } from "react-icons/md";
import axios from "axios";

function Customize() {
    const {
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        userData,
        setUserData,
        serverUrl,
    } = useContext(userDataContext);

    const navigate = useNavigate();
    const inputImage = useRef();
    const [rotate, setRotate] = useState(false);
    const [loading, setLoading] = useState(false);

    const isReturningUser = Boolean(
        userData?.assistantName || userData?.assistantImage
    );

    const predefinedImages = [img1, img2, img3, img4, img5, img6, img7, img8];

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setBackendImage(file);
            setFrontendImage(url);
            setSelectedImage(url);
            e.target.value = null;
        }
    };

    const handlePredefinedSelect = (img) => {
        setSelectedImage(img);
        setFrontendImage(null);
        setBackendImage(null);
    };

    const handleIconClick = () => {
        setRotate(true);
        setTimeout(() => {
            setRotate(false);
            inputImage.current.click();
        }, 300);
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setBackendImage(null);
        setFrontendImage(null);
        setSelectedImage(null);
    };

    const handleDone = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            if (backendImage) {
                formData.append("assistantImage", backendImage);
            } else {
                formData.append("imageUrl", selectedImage);
            }

            const { data } = await axios.post(
                `${serverUrl}/api/user/updateAssistant`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setUserData(data);
            navigate("/");
        } catch (err) {
            console.error("Error updating assistant:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setLoading(true);
        navigate("/customize2");
    };

    const isUploadedSelected = frontendImage && selectedImage === frontendImage;

    return (
        <>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full bg-[#6a6a6a00] z-50 flex justify-center items-center backdrop-blur-sm">
                    <svg
                        className="w-22 h-22 animate-spin text-blue-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )}

            <div className="min-h-screen bg-[#e3ebf1] py-15 px-8 md:py-10 md:p-10 flex justify-center items-center flex-col relative">
                {isReturningUser && (
                    <MdOutlineArrowBackIos
                        className="fixed top-6 left-8 text-4xl cursor-pointer rounded-full bg-[#afafaf5c] p-2 z-50"
                        onClick={() => navigate("/")}
                    />
                )}
                <h1 className="text-neutral-800 text-[30px] font-semibold mb-[40px] text-shadow-lg/20">
                    Select your{" "}
                    <span className="text-blue-700">Assistant Image</span>
                </h1>

                <div className="w-[90%] md:w-[60%] flex justify-center items-center flex-wrap gap-5">
                    {predefinedImages.map((img, index) => (
                        <Card
                            key={index}
                            image={img}
                            selected={selectedImage === img}
                            onClick={() => handlePredefinedSelect(img)}
                        />
                    ))}

                    <div
                        className={`relative w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#bebebe] border-3 rounded-2xl overflow-hidden shadow-xl 
          cursor-pointer transition delay-100 duration-300 ease-out 
          flex items-center justify-center
          ${
              isUploadedSelected
                  ? "border-5 border-blue-700 shadow-blue-700/70 -translate-y-1 scale-110"
                  : "border-gray-400 shadow-gray-400 hover:-translate-y-1 hover:scale-110 hover:border-5 hover:border-blue-700 hover:shadow-blue-700/70"
          }`}
                        onClick={
                            !frontendImage
                                ? handleIconClick
                                : () => setSelectedImage(frontendImage)
                        }
                    >
                        {!frontendImage ? (
                            <PiPlus
                                className={`text-gray-600 w-12 h-12 lg:w-20 lg:h-20 origin-center ${
                                    rotate ? "animate-rotate-once" : ""
                                }`}
                            />
                        ) : (
                            <>
                                <img
                                    src={frontendImage}
                                    alt="Custom"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 flex items-center justify-center"
                                >
                                    <FaDeleteLeft className="w-6 h-6 text-black" />
                                </button>
                            </>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        ref={inputImage}
                        hidden
                        onChange={handleImage}
                    />
                </div>

                <div className="flex mt-12 gap-4">
                    {selectedImage && isReturningUser && (
                        <button
                            className="w-25 md:w-50 bg-blue-700 hover:bg-blue-800 text-white text-sm md:text-lg py-3 rounded-xl disabled:opacity-60 cursor-pointer"
                            onClick={handleDone}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Done"}
                        </button>
                    )}
                    {selectedImage && (
                        <button
                            className={`${
                                isReturningUser ? "w-25 md:w-50" : "w-90"
                            } bg-blue-700 hover:bg-blue-800 text-white text-sm md:text-lg py-3 rounded-xl disabled:opacity-60 cursor-pointer`}
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Next"}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Customize;
