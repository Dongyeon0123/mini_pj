'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Settings,
  Captions,
  RotateCcw,
  RotateCw
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onClose?: () => void;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
}

const PlayerContainer = styled.div<{ $isFullscreen: boolean }>`
  position: ${({ $isFullscreen }) => $isFullscreen ? 'fixed' : 'relative'};
  top: ${({ $isFullscreen }) => $isFullscreen ? '0' : 'auto'};
  left: ${({ $isFullscreen }) => $isFullscreen ? '0' : 'auto'};
  right: ${({ $isFullscreen }) => $isFullscreen ? '0' : 'auto'};
  bottom: ${({ $isFullscreen }) => $isFullscreen ? '0' : 'auto'};
  width: ${({ $isFullscreen }) => $isFullscreen ? '100vw' : '100%'};
  height: ${({ $isFullscreen }) => $isFullscreen ? '100vh' : 'auto'};
  background-color: ${({ theme }) => theme.colors.black};
  z-index: ${({ $isFullscreen, theme }) => $isFullscreen ? theme.zIndex.modal : 'auto'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: ${({ theme }) => theme.colors.black};
`;

const ControlsOverlay = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    transparent 20%,
    transparent 80%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: ${({ $show }) => $show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $show }) => $show ? 'auto' : 'none'};
`;

const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const VideoTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin: 0;
`;

const TopRightControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ControlButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

const CenterControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const PlayButton = styled.button`
  width: 4rem;
  height: 4rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
`;

const SkipButton = styled.button`
  width: 3rem;
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

const BottomControls = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ProgressContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  position: relative;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.1s ease;
`;

const ProgressHandle = styled.div<{ $progress: number }>`
  position: absolute;
  top: 50%;
  left: ${({ $progress }) => $progress}%;
  width: 1rem;
  height: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ProgressBar}:hover & {
    opacity: 1;
  }
`;

const TimeDisplay = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  justify-content: space-between;
`;

const BottomControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const VolumeSlider = styled.input`
  width: 6rem;
  height: 0.25rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 1rem;
    height: 1rem;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`;

const SpeedSelector = styled.select`
  background-color: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  onClose,
  autoPlay = false,
  controls = true,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpeedSelector, setShowSpeedSelector] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.muted = isMuted;
    video.playbackRate = playbackRate;
  }, [volume, isMuted, playbackRate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    video.currentTime = newTime;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <PlayerContainer $isFullscreen={isFullscreen} className={className}>
      <VideoWrapper>
        <Video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          onClick={togglePlay}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        
        {isLoading && <LoadingSpinner />}

        {controls && (
          <ControlsOverlay $show={showControls}>
            <TopControls>
              <VideoTitle>{title}</VideoTitle>
              <TopRightControls>
                <ControlButton onClick={() => setShowSpeedSelector(!showSpeedSelector)}>
                  <Settings size={20} />
                </ControlButton>
                <ControlButton onClick={onClose}>
                  <Minimize size={20} />
                </ControlButton>
              </TopRightControls>
            </TopControls>

            <CenterControls>
              <SkipButton onClick={() => skip(-10)}>
                <SkipBack size={20} />
              </SkipButton>
              <PlayButton onClick={togglePlay}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </PlayButton>
              <SkipButton onClick={() => skip(10)}>
                <SkipForward size={20} />
              </SkipButton>
            </CenterControls>

            <BottomControls>
              <ProgressContainer>
                <ProgressBar onClick={handleProgressClick}>
                  <ProgressFill $progress={progress} />
                  <ProgressHandle $progress={progress} />
                </ProgressBar>
              </ProgressContainer>

              <TimeDisplay>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </TimeDisplay>

              <BottomControlsRow>
                <LeftControls>
                  <ControlButton onClick={togglePlay}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </ControlButton>
                  
                  <VolumeContainer>
                    <ControlButton onClick={toggleMute}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </ControlButton>
                    <VolumeSlider
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                    />
                  </VolumeContainer>

                  {showSpeedSelector && (
                    <SpeedSelector
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    >
                      {speedOptions.map((speed) => (
                        <option key={speed} value={speed}>
                          {speed}x
                        </option>
                      ))}
                    </SpeedSelector>
                  )}
                </LeftControls>

                <RightControls>
                  <ControlButton>
                    <Captions size={20} />
                  </ControlButton>
                  <ControlButton onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </ControlButton>
                </RightControls>
              </BottomControlsRow>
            </BottomControls>
          </ControlsOverlay>
        )}
      </VideoWrapper>
    </PlayerContainer>
  );
};

export default VideoPlayer;
