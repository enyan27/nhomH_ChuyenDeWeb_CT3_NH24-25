import React, { useState } from "react";
import useBackdropPicture from "hooks/useBackropPicture";
import ButtonGradient from "components/button/ButtonGradient";
import PictureDialog from "components/picture/PictureDialog";
// Fix UI - 4 layout
const PostImage = ({ listImg = [] }) => {
  const { openState, pictureState, handleShowBackdrop } = useBackdropPicture();
  const [clickedPosition, setClickedPosition] = useState(0);

  const handleImageClick = (index) => {
    setClickedPosition(index);
    handleShowBackdrop(listImg);
  };

  const renderImages = () => {
    const imageCount = listImg.length;
    if (imageCount === 1) {
      return (
        <img
          src={listImg[0]}
          onClick={() => handleImageClick(0)}
          className="object-cover w-full h-full max-h-[500px] cursor-pointer"
          alt=""
        />
      );
    } else if (imageCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {listImg.slice(0, 2).map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => handleImageClick(index)}
              className="object-cover w-full h-full cursor-pointer"
              alt=""
            />
          ))}
        </div>
      );
    } else if (imageCount === 3) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1">
          <img
            src={listImg[0]}
            onClick={() => handleImageClick(0)}
            className="object-cover w-full h-full row-span-2 cursor-pointer"
            alt=""
          />
          {listImg.slice(1, 3).map((img, index) => (
            <img
              key={index + 1}
              src={img}
              onClick={() => handleImageClick(index + 1)}
              className="object-cover w-full h-full cursor-pointer"
              alt=""
            />
          ))}
        </div>
      );
    } else if (imageCount === 4) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {listImg.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => handleImageClick(index)}
              className="object-cover w-full h-full cursor-pointer"
              alt=""
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-1 relative">
          {listImg.slice(0, 3).map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => handleImageClick(index)}
              className="object-cover w-full h-full cursor-pointer"
              alt=""
            />
          ))}
          <div
            className="relative cursor-pointer"
            onClick={() => handleImageClick(3)}
          >
            <img src={listImg[3]} className="object-cover w-full h-full" alt="" />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-medium">
              +{imageCount - 4}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-xl">
        {renderImages()}
      </div>
      <PictureDialog
        openState={openState}
        pictureState={pictureState}
        position={clickedPosition}
      />
    </>
  );
};

export default PostImage;
