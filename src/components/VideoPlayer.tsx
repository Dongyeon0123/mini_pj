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
  RotateCw,
  X
} from 'lucide-react';

interface Subtitle {
  language: string;
  label: string;
  src: string;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onClose?: () => void;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  subtitles?: Subtitle[];
  contentId?: number;
  userId?: number;
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
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
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
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

const CloseButton = styled.button`
  width: 3rem;
  height: 3rem;
  background-color: rgba(239, 68, 68, 0.8);
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: bold;
  font-size: 1.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
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

const SettingsMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  bottom: 5rem;
  right: ${({ theme }) => theme.spacing[4]};
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[2]};
  min-width: 200px;
  display: ${({ $show }) => $show ? 'block' : 'none'};
  z-index: 1000;
`;

const MenuTitle = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const MenuItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary[500] : 'transparent'
  };
  color: ${({ theme }) => theme.colors.white};
  border: none;
  text-align: left;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $active, theme }) => 
      $active ? theme.colors.primary[600] : 'rgba(255, 255, 255, 0.1)'
    };
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
  subtitles = [],
  contentId,
  userId,
  initialTime = 0,
  onTimeUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 초기 재생 시간 설정 (이어보기)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      
      // 초기 시간이 설정되어 있으면 해당 위치로 이동
      if (initialTime > 0) {
        video.currentTime = Math.min(initialTime, video.duration);
        console.log('🎬 이어보기 시작:', initialTime, '초');
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      // 재생 완료 시 시청 위치 저장 (마지막 위치)
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }
    };

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
  }, [initialTime, onTimeUpdate]);

  // 주기적으로 시청 위치 저장 (5초마다)
  useEffect(() => {
    if (!isPlaying || !onTimeUpdate) return;

    timeUpdateIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (video && video.currentTime > 0) {
        onTimeUpdate(video.currentTime);
        console.log('💾 시청 위치 저장:', Math.floor(video.currentTime), '초');
      }
    }, 5000);

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [isPlaying, onTimeUpdate]);

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

  const toggleFullscreen = async () => {
    const container = playerContainerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        // 전체화면 진입
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // 전체화면 종료
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('전체화면 전환 실패:', error);
    }
  };

  // 브라우저 전체화면 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // ESC 키로 플레이어 닫기
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose && !isFullscreen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose, isFullscreen]);

  // 자막 활성화/비활성화
  const toggleSubtitles = () => {
    const video = videoRef.current;
    if (!video) return;

    if (subtitlesEnabled) {
      // 자막 비활성화
      Array.from(video.textTracks).forEach(track => {
        track.mode = 'disabled';
      });
      setSubtitlesEnabled(false);
      setSelectedSubtitle(null);
    } else {
      // 자막 활성화 (첫 번째 자막 선택)
      if (video.textTracks.length > 0) {
        video.textTracks[0].mode = 'showing';
        setSubtitlesEnabled(true);
        setSelectedSubtitle(video.textTracks[0].language);
      }
    }
    setShowSubtitleMenu(false);
  };

  // 특정 자막 선택
  const selectSubtitle = (language: string) => {
    const video = videoRef.current;
    if (!video) return;

    Array.from(video.textTracks).forEach(track => {
      if (track.language === language) {
        track.mode = 'showing';
        setSelectedSubtitle(language);
        setSubtitlesEnabled(true);
      } else {
        track.mode = 'disabled';
      }
    });
    setShowSubtitleMenu(false);
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
    <PlayerContainer ref={playerContainerRef} $isFullscreen={isFullscreen} className={className}>
      <VideoWrapper>
        <Video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          onClick={togglePlay}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          crossOrigin="anonymous"
        >
          {subtitles.map((subtitle) => (
            <track
              key={subtitle.language}
              kind="subtitles"
              src={subtitle.src}
              srcLang={subtitle.language}
              label={subtitle.label}
            />
          ))}
        </Video>
        
        {isLoading && <LoadingSpinner />}

        {controls && (
          <ControlsOverlay $show={showControls}>
            <TopControls>
              <VideoTitle>{title}</VideoTitle>
              <TopRightControls>
                {onClose && (
                  <CloseButton onClick={onClose} title="닫기 (ESC)">
                    <X size={24} />
                  </CloseButton>
                )}
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
                </LeftControls>

                <RightControls>
                  {subtitles.length > 0 && (
                    <ControlButton 
                      onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                      style={{ color: subtitlesEnabled ? '#10b981' : 'white' }}
                      title="자막"
                    >
                      <Captions size={20} />
                    </ControlButton>
                  )}
                  
                  <ControlButton 
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    title="재생 속도"
                  >
                    <Settings size={20} />
                  </ControlButton>
                  
                  <ControlButton onClick={toggleFullscreen} title="전체화면">
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </ControlButton>
                </RightControls>
              </BottomControlsRow>

              {/* 재생 속도 메뉴 */}
              <SettingsMenu $show={showSpeedMenu}>
                <MenuTitle>재생 속도</MenuTitle>
                {speedOptions.map((speed) => (
                  <MenuItem
                    key={speed}
                    $active={playbackRate === speed}
                    onClick={() => {
                      setPlaybackRate(speed);
                      setShowSpeedMenu(false);
                    }}
                  >
                    {speed}x {speed === 1 && '(기본)'}
                  </MenuItem>
                ))}
              </SettingsMenu>

              {/* 자막 메뉴 */}
              {subtitles.length > 0 && (
                <SettingsMenu $show={showSubtitleMenu}>
                  <MenuTitle>자막</MenuTitle>
                  <MenuItem
                    $active={!subtitlesEnabled}
                    onClick={toggleSubtitles}
                  >
                    자막 끄기
                  </MenuItem>
                  {subtitles.map((subtitle) => (
                    <MenuItem
                      key={subtitle.language}
                      $active={subtitlesEnabled && selectedSubtitle === subtitle.language}
                      onClick={() => selectSubtitle(subtitle.language)}
                    >
                      {subtitle.label}
                    </MenuItem>
                  ))}
                </SettingsMenu>
              )}
            </BottomControls>
          </ControlsOverlay>
        )}
      </VideoWrapper>
    </PlayerContainer>
  );
};

export default VideoPlayer;


