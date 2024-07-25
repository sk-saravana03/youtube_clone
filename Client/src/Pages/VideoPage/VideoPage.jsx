import React, { useEffect, useRef, useState } from 'react';
import "./VideoPage.css";
import moment from 'moment';
import Likewatchlatersavebtns from './LikeWatchLaterSaveBtns';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Comment from '../../Component/Comment/Comment';
import { viewvideo, addPoints } from '../../action/video';
import { addtohistory } from '../../action/history';
import { useSelector, useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';

const VideoPage = () => {
    const { vid } = useParams();
    const dispatch = useDispatch();
    const vids = useSelector((state) => state.videoreducer);
    const vv = vids?.data.find((q) => q._id === vid);
    const currentuser = useSelector(state => state?.currentuserreducer);
    const playerRef = useRef(null);
    const commentsRef = useRef(null);
    const holdTimeoutRef = useRef(null);
    const [leftTapCount, setLeftTapCount] = useState(0);
    const [rightTapCount, setRightTapCount] = useState(0);
    const [middleTapCount, setMiddleTapCount] = useState(0);
    const [locationAndTemp, setLocationAndTemp] = useState(null);
    const leftTapTimeoutRef = useRef(null);
    const rightTapTimeoutRef = useRef(null);
    const middleTapTimeoutRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (vv) {
            console.log("Video Data:", vv);
        } else {
            console.log("No video data found for vid:", vid);
        }
    }, [vv]);

    const handleviews = () => {
        dispatch(viewvideo({ id: vid }));
    };

    const handlehistory = () => {
        dispatch(addtohistory({
            videoid: vid,
            viewer: currentuser?.result?._id,
        }));
    };

    const handlePoints = () => {
        dispatch(addPoints({
            id: vid,
            Viewer: currentuser?.result?._id,
        }));
        console.log("Points Added");
    };

    useEffect(() => {
        if (currentuser) {
            handlehistory();
        }
        handleviews();
        const player = playerRef.current.getInternalPlayer();
        if (player) {
            player.addEventListener('ended', handlePoints);
        }

        return () => {
            if (player) {
                player.removeEventListener('ended', handlePoints);
            }
        };
    }, [vid]);

    const handleDoubleClick = (e) =>
    {
        e.preventDefault();
        const player = playerRef.current;
        if (player) {
          const videoElement = player.getInternalPlayer();
          const boundingRect = videoElement.getBoundingClientRect();
          const clickPositionX = e.clientX - boundingRect.left;
      
          if (clickPositionX > boundingRect.width / 2) {
            videoElement.currentTime += 10; 
          } else {
            videoElement.currentTime -= 10; 
          }
        }
    };

    const requestFullscreen = (element) => {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { /* Firefox */
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { /* IE/Edge */
            element.msRequestFullscreen();
        }
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'f' || e.key === 'F') {
            const playerWrapper = document.querySelector('.video_display_screen_videoPage');
            if (playerWrapper) {
                // if (!document.fullscreenElement) {
                //     requestFullscreen(video);
                // } else {
                //     exitFullscreen();
                // }
                playerWrapper.classList.toggle('fullscreen')
            }
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

      const handleMouseDown = (e) => {
        const player = playerRef.current;
        if (player) {
          const videoElement = player.getInternalPlayer();
          const boundingRect = videoElement.getBoundingClientRect();
          const clickPositionX = e.clientX - boundingRect.left;
      
          holdTimeoutRef.current = setTimeout(() => {
            if (clickPositionX > boundingRect.width / 2) {
              videoElement.playbackRate = 2; // Right side hold
            } else {
              videoElement.playbackRate = 0.5; // Left side hold
            }
          }, 500); // Adjust delay as needed
        }
      };

      const handleMouseUp = () => {
        const player = playerRef.current;
        if (player) {
          const videoElement = player.getInternalPlayer();
          clearTimeout(holdTimeoutRef.current);
          videoElement.playbackRate = 1; // Reset speed
        }
      };

      const handleMouseLeave = () => {
        const player = playerRef.current;
        if (player) {
          const videoElement = player.getInternalPlayer();
          clearTimeout(holdTimeoutRef.current);
          videoElement.playbackRate = 1; // Reset speed
        }
      };

    const getNextVideoId = () => {
        const currentIndex = vids?.data.findIndex((video) => video._id === vid);
        if (currentIndex !== -1 && currentIndex + 1 < vids.data.length) {
            return vids.data[currentIndex + 1]._id;
        }
        return null;
    };

    const handleTripleTap = (e) => {
        const player = playerRef.current;
        if (player) {
            const videoElement = player.getInternalPlayer();
            const boundingRect = videoElement.getBoundingClientRect();
            const clickPositionX = e.clientX - boundingRect.left;
    
            if (clickPositionX <= boundingRect.width / 3) {
                setLeftTapCount(leftTapCount + 1);
    
                if (leftTapTimeoutRef.current) {
                    clearTimeout(leftTapTimeoutRef.current);
                }
    
                leftTapTimeoutRef.current = setTimeout(() => {
                    setLeftTapCount(0);
                }, 500);
    
                if (leftTapCount === 2) {
                    commentsRef.current.scrollIntoView({ behavior: "smooth" });
                    setLeftTapCount(0);
                }
            } else if (clickPositionX >= (2 * boundingRect.width) / 3) {
                setRightTapCount(rightTapCount + 1);
    
                if (rightTapTimeoutRef.current) {
                    clearTimeout(rightTapTimeoutRef.current);
                }
    
                rightTapTimeoutRef.current = setTimeout(() => {
                    setRightTapCount(0);
                }, 500);
    
                if (rightTapCount === 2) {
                    window.close();
                    setRightTapCount(0);
                }
            } else {
                setMiddleTapCount(middleTapCount + 1);
    
                if (middleTapTimeoutRef.current) {
                    clearTimeout(middleTapTimeoutRef.current);
                }
    
                middleTapTimeoutRef.current = setTimeout(() => {
                    setMiddleTapCount(0);
                }, 500);
    
                if (middleTapCount === 2) {
                    const nextVideoId = getNextVideoId();
                    if (nextVideoId) {
                        navigate(`/videopage/${nextVideoId}`);
                    }
                    setMiddleTapCount(0);
                }
            }
        }
    };

    

    const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const getWeather = async (lat, lon) => {
        const apiKey = "62c2d5ebfc7b4793bab173206242307";
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
        );
        if (response.ok) {
            return response.json();
        } else {
            return;
        }
    };

    const handleSingleTapTopRight = async (e) => {
        const player = playerRef.current;
        if (player) {
          const videoElement = player.getInternalPlayer();
          const boundingRect = videoElement.getBoundingClientRect();
          const clickPositionX = e.clientX - boundingRect.left;
          const clickPositionY = e.clientY - boundingRect.top;
      
          if (
            clickPositionX > boundingRect.width * 0.9 &&
            clickPositionY < boundingRect.height * 0.1
          ) {
            const position = await getCurrentPosition();
            if (position) {
              const weather = await getWeather(position.coords.latitude, position.coords.longitude);
              if (weather) {
                setLocationAndTemp(
                  `Location: ${weather.location.name}, Temperature: ${weather.current.temp_c}°C`
                );
                setTimeout(() => {
                  setLocationAndTemp(null);
                }, 5000); // Hide the popup after 5 seconds
              }
            }
          }
        }
      };

    if (!vv) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="container_videoPage">
                <div className="container2_videoPage">
                    <div className="video_display_screen_videoPage"
                        onDoubleClick={handleDoubleClick}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onClick={(e) => {
                            handleTripleTap(e);
                            handleSingleTapTopRight(e);
                        }}
                    >
                        <ReactPlayer
                            ref={playerRef}
                            url={`http://localhost:5500/${vv?.filepath}`}
                            className="video_ShowVideo_videoPage"
                            controls
                            onDoubleClick={handleDoubleClick}
                        />
                        {locationAndTemp && (
                            <div className="location-temp-popup">
                                {locationAndTemp}
                            </div>
                        )}

                        <div className="video_details_videoPage">
                            <div className="video_btns_title_VideoPage_cont">
                                <p className="video_title_VideoPage">{vv?.videotitle}</p>
                                <div className="views_date_btns_VideoPage">
                                    <div className="views_videoPage">
                                        {vv?.views} views <div className="dot"></div>{" "}
                                        {moment(vv?.createdAt).fromNow()}
                                    </div>
                                    <Likewatchlatersavebtns vv={vv} vid={vid} />
                                </div>
                            </div>
                            <Link to={`/channel/${vv?.videochanel}`}
                                className='chanel_details_videoPage'>
                                <b className="chanel_logo_videoPage">
                                    <p>{vv.uploader?.charAt(0).toUpperCase()}</p>
                                </b>
                                <p className="chanel_name_videoPage">{vv?.uploader}</p>
                            </Link>
                            <div className="comments_VideoPage"
                                ref={commentsRef}
                            >
                                <h2>
                                    <u>Comments</u>
                                </h2>
                                <Comment
                                    videoid={vv._id}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="moreVideoBar">More videos</div>
                </div>
            </div>
        </>
    )
}

export default VideoPage;
