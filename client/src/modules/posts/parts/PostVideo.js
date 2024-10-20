import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

const PostVideo = ({ src = "", thumbnail = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const playerRef = useRef(null);
  const previewDuration = 5;

  useEffect(() => {
    let previewInterval;

    if (isHovered && isPreview) {
      setPlaying(true);

      previewInterval = setInterval(() => {
        if (isHovered) {
          playerRef.current.seekTo(0);
        } else {
          clearInterval(previewInterval);
          setPlaying(false);
        }
      }, previewDuration * 1000);
    }

    return () => clearInterval(previewInterval);
  }, [isHovered, isPreview]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isPreview) {
      setPlaying(false);
      playerRef.current.seekTo(0);
    }
  };

  const handleClickPlay = () => {
    setPlaying(true);
    setIsPreview(false);
  };

  return (
    <div 
      className="relative player-wrapper rounded-lg overflow-hidden group"
      onClick={handleClickPlay}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactPlayer
        ref={playerRef}
        url={src}
        className="react-player"
        width="100%"
        height="100%"
        controls={!isPreview}
        playing={playing}
        light={isPreview ? thumbnail : false}
        loop={false}
        muted={isPreview}
        config={{
          youtube: {
            playerVars: { start: 0 }
          }
        }}
      />
      
      {/* Play Button */}
      {isPreview && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="w-16 h-16 bg-gray-900 bg-opacity-70 text-white rounded-xl"
            onClick={handleClickPlay}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default PostVideo;
