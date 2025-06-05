import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
    const {
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
    } = useContext(userDataContext);

    const isSelected = selectedImage === image;

    return (
        <div
            className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#bebebe] 
            border-3 rounded-2xl overflow-hidden shadow-xl cursor-pointer 
            transition delay-100 duration-300 ease-out 
            hover:shadow-blue-700/70 hover:border-5 hover:border-blue-700 
            hover:-translate-y-1 hover:scale-110
            ${
                isSelected
                    ? "border-5 border-blue-700 shadow-blue-700/70 -translate-y-1 scale-110"
                    : "border-gray-400 shadow-gray-400"
            }
            `}
            onClick={() => {
                setSelectedImage(image);
                setBackendImage(null);
                setFrontendImage(null);
            }}
        >
            <img
                src={image}
                alt="card-img"
                className="h-full w-full object-cover"
            />
        </div>
    );
}

export default Card;
