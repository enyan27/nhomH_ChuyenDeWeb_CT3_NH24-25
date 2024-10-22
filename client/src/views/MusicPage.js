import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBackward, faForward, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BackPage from "components/common/BackPage"; // Thêm import cho BackPage

library.add(faBackward, faForward, faPlay, faPause);

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap');
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
`;

const Background = styled.div`
position: fixed;
width: 200%;
height: 200%;
top: -50%;
left: -50%;
z-index: -1;
`;

const Container = styled.div`
background-color: #e7e7e7;
height: 540px;
width: 400px;
border-radius: 20px;
box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
transition: all 0.5s ease;
margin-left: 85px;
margin-top: 100px;
padding-bottom: 40px;
`;

const PlayerImg = styled.div`
width: 300px;
height: 300px;
position: relative;
top: -50px;
left: 50px;
img {
    width: 100%;
    height: 100%;
    border-radius: 20px;
}
`;

const Title = styled.h2`
font-size: 25px;
text-align: center;
font-weight: 600;
`;

const Artist = styled.h3`
font-size: 18px;
text-align: center;
font-weight: 500;
margin-top: 10px;
`;

const PlayerProgress = styled.div`
background-color: #fff;
border-radius: 5px;
cursor: pointer;
margin: 40px 20px 35px;
height: 6px;
width: 90%;
`;

const Progress = styled.div`
background-color: rgba(0, 0, 0, 0.8);
border-radius: 5px;
height: 100%;
width: 0%;
transition: width 0.1s linear;
`;

const MusicDuration = styled.div`
display: flex;
justify-content: space-between;
position: relative;
top: -30px;
font-size: 13px;
`;

const PlayerControls = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-top: 10px;

.icon {
    font-size: 27px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
    filter: brightness(40%);
    }
}

.play-pause {
    font-size: 47px;
    margin: 0 25px;
}
`;

const Playlist = styled.div`
display: flex;
flex-direction: column;
margin-top: 50px;
padding-top: 20px;
overflow-y: auto;
`;

const SongItem = styled.div`
display: flex;
justify-content: space-between;
padding: 10px;
cursor: pointer;
background-color: ${(props) => (props.isActive ? '#d1d1d1' : 'transparent')};
border-radius: 5px;
transition: background-color 0.3s ease;
&:hover {
    background-color: #f0f0f0;
}

`;

const SongInfo = styled.div`
display: flex;
align-items: center;
gap: 10px;
`;

const songs = [
{
    path: 'audio/MOTTO!!!.ogg',
    displayName: 'MOTTO!!!',
    cover: 'img/ChimCanhCut.jpg',
    artist: 'MORE MORE JUMP! × 初音ミク',
    album: 'Album 1',
    duration: '4:11',
    dateAdded: '20 thg 8, 2024'
},
{
    path: 'audio/JUMPIN’_OVER!.ogg',
    displayName: 'JUMPIN’_OVER!',
    cover: 'img/Cat.jpg',
    artist: 'Yay!" やった！',
    album: 'Album 2',
    duration: '3:30',
    dateAdded: '20 thg 8, 2024'
},
];

const MusicPlayer = () => {
    const [musicIndex, setMusicIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(new Audio(songs[musicIndex].path));
    const progressRef = useRef(null);

    const playMusic = () => {
        setIsPlaying(true);
        audioRef.current.play();
    };

    const pauseMusic = () => {
        setIsPlaying(false);
        audioRef.current.pause();
    };

    const togglePlay = () => {
        isPlaying ? pauseMusic() : playMusic();
    };

    const changeMusic = (index) => {
        setMusicIndex(index);
    };

    const updateProgress = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const setProgress = (e) => {
        const width = progressRef.current.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        audioRef.current.currentTime = (clickX / width) * audioRef.current.duration;
    };

    useEffect(() => {
        audioRef.current.src = songs[musicIndex].path;
        audioRef.current.load();

        audioRef.current.addEventListener('loadedmetadata', () => {
            setDuration(audioRef.current.duration);
        });

        if (isPlaying) {
            audioRef.current.play();
        }

        audioRef.current.addEventListener('timeupdate', updateProgress);
        audioRef.current.addEventListener('ended', () => changeMusic((musicIndex + 1) % songs.length));

        return () => {
            audioRef.current.pause();
            audioRef.current.removeEventListener('timeupdate', updateProgress);
            audioRef.current.removeEventListener('ended', () => changeMusic((musicIndex + 1) % songs.length));
            audioRef.current.removeEventListener('loadedmetadata', updateProgress);
        };
    }, [musicIndex, isPlaying]);

    return (
        <>
            <GlobalStyle />
            
            {/* Thêm BackPage vào đây */}
            <BackPage haveBackBtn={false}>
                <div className="flex flex-col px-3"> 
                    <h4 className="text-lg font-bold">Music</h4> 
                    <p className="text-[13px] font-normal text-text4">
                        {songs.length} Music 
                    </p>
                </div>
            </BackPage>

            <Container>
                <Background>
                    <img src={songs[musicIndex].cover} alt="Background" />
                </Background>
                <PlayerImg>
                    <img src={songs[musicIndex].cover} alt="Cover" />
                </PlayerImg>
                <Title>{songs[musicIndex].displayName}</Title>
                <Artist>{songs[musicIndex].artist}</Artist>
                <PlayerProgress ref={progressRef} onClick={setProgress}>
                    <Progress style={{ width: `${(currentTime / duration) * 100}%` }}></Progress>
                    <MusicDuration>
                        <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                        <span>
                            {`${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`}
                        </span>
                    </MusicDuration>
                </PlayerProgress>
                <PlayerControls>
                    <FontAwesomeIcon icon="backward" className="icon" onClick={() => changeMusic((musicIndex - 1 + songs.length) % songs.length)} />
                    <FontAwesomeIcon icon={isPlaying ? "pause" : "play"} className="icon play-pause" onClick={togglePlay} />
                    <FontAwesomeIcon icon="forward" className="icon" onClick={() => changeMusic((musicIndex + 1) % songs.length)} />
                </PlayerControls>
                
                <Playlist>
                    {songs.map((song, index) => (
                        <SongItem key={index} isActive={index === musicIndex} onClick={() => changeMusic(index)}>
                            <SongInfo>
                                <img src={song.cover} alt="Song Cover" style={{ width: 50, height: 50, borderRadius: 4 }} />
                                <div>
                                    <div>{song.displayName}</div>
                                    <div>{song.artist}</div>
                                </div>
                            </SongInfo>
                            <div>{song.duration}</div>
                        </SongItem>
                    ))}
                </Playlist>
            </Container>
        </>
    );
};

export default MusicPlayer;
