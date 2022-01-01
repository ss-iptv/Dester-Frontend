import { Alert, Badge, Breadcrumb, Button, Container, Modal, Ratio } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { BACKDROP_SIZE, POSTER_SIZE, TMDB_IMAGE_BASE_URL } from '../../config';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ReactStars from "react-rating-stars-component";
import 'react-circular-progressbar/dist/styles.css';
import { useFetchMultiSingle } from '../../utilities/useFetchMultiUrl';
import PosterPlaceholder from '../../assets/rectangle-poster.svg';
import { useState } from 'react';
import { SugoiSkeletonItemPage } from '../../Components';
import Plyr from 'plyr-react';
import 'plyr-react/dist/plyr.css';
import './style.css';
import SugoiError from '../../Components/SugoiError/SugoiError';

const SugoiMoviePage = () => {

    // Pop Modal

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showResults, setShowResults] = useState(false);
    const showVideoPlayer = () => setShowResults(true);

    const options = {
        controls: [
          'play-large',
          'rewind',
          'play',
          'fast-forward',
          'current-time',
          'progress',
          'duration',
          'mute',
          'volume',
          'download',
          'settings',
          'fullscreen',
        ],
        autoplay: false,
        muted: false,
    }

    const location = useLocation();
    const path = location.pathname.split("/")[2];

    const { mainUrlDataSingle, tmdbUrlDataSingle, loadingMultiUrlSingle, errorMultiUrlSingle } = useFetchMultiSingle(process.env.REACT_APP_S_API_URL, process.env.REACT_APP_TMDB_API_KEY, "movies", "movie", path);

    if (loadingMultiUrlSingle) return <SugoiSkeletonItemPage/>;

    if ( !mainUrlDataSingle ) return (<SugoiError errorCode="404" message="Can't Find Movie"/>);

    if (errorMultiUrlSingle) console.log(errorMultiUrlSingle);

    return (
        <div>
            { mainUrlDataSingle && tmdbUrlDataSingle && (
                <Container fluid className="g-0">
                    <Container fluid className="ps-3 pe-3">
                        <Breadcrumb className="details-breadcrumb">
                            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                            <Breadcrumb.Item href="/movies">Movies</Breadcrumb.Item>
                            <Breadcrumb.Item active>{tmdbUrlDataSingle.title} {mainUrlDataSingle.audio}</Breadcrumb.Item>
                        </Breadcrumb>
                    </Container>
                    {mainUrlDataSingle.video_info.length > 0 ? "" : <Alert variant="danger" className="m-3">No Sources Found!<br/><span>Contact <a className="alert-link-standout" href="https://t.me/+P8oPYF5_ph1jYTM1">Admin</a></span></Alert>}
                    <div className="backdrop-img"><img src={TMDB_IMAGE_BASE_URL + BACKDROP_SIZE +  tmdbUrlDataSingle.backdrop_path} onError={(e)=>{e.target.onerror = null; e.target.src=PosterPlaceholder}} alt={tmdbUrlDataSingle.title + "[backdrop]"}/></div>
                    <div className="item-details-content">
                        <div className="row">
                                <div className="col-lg-3">
                                    <div className="item-details-content-poster"> 
                                    <img className="img-fluid rounded" src={TMDB_IMAGE_BASE_URL + POSTER_SIZE + "/" +  mainUrlDataSingle.poster} onError={(e)=>{e.target.onerror = null; e.target.src=TMDB_IMAGE_BASE_URL + BACKDROP_SIZE +  tmdbUrlDataSingle.poster_path}} alt={mainUrlDataSingle.title + "[poster]"} />
                                    <div className="item-details-content-poster-info">
                                        <div className="rating-info">
                                            <CircularProgressbar
                                                value={tmdbUrlDataSingle.vote_average * 10}
                                                text={`${tmdbUrlDataSingle.vote_average * 10}%`}
                                                background={true}
                                                backgroundPadding={5}
                                                maxValue={100}
                                                styles={buildStyles({
                                                    rotation: 0.25,
                                                    strokeLinecap: 'butt',
                                                    textSize: '25px',
                                                    pathTransitionDuration: 0.5,
                                                    pathColor: `rgb(20, 220, 160)`,
                                                    textColor: '#ffffff',
                                                    trailColor: '#165764',
                                                    backgroundColor: '#0a2b31',
                                                })}
                                            />
                                        </div>
                                    </div>
                                        <div className="item-details-btn"> 
                                            {mainUrlDataSingle.video_info.length > 0 ? <Button className="s-btn-1" variant="primary" href="#video-container" onClick={showVideoPlayer}>Watch</Button> : <Button className="s-btn-1" variant="danger" disabled>Unavailable</Button>}
                                            <div className="item-details-btn-bottom">
                                                <Button className="s-btn-2" onClick={handleShow} variant="primary"><i className="bi bi-youtube"></i></Button>
                                                <Button className="s-btn-2" variant="primary"><i className="bi bi-bookmark-plus"></i></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <div className="item__details__text">
                                        <div className="item__details__title">
                                            <h3>{tmdbUrlDataSingle.title}</h3> <span>Original Title: {tmdbUrlDataSingle.original_title}</span> </div>
                                        <div className="item__details__rating"></div>
                                            <div className="rating">
                                                <ReactStars 
                                                    count={5} 
                                                    value={tmdbUrlDataSingle.vote_average / 10 * 5} 
                                                    size={24} 
                                                    edit={false} 
                                                    isHalf={true}
                                                    activeColor="#ffd700"
                                                />
                                                <span style={{color: 'white'}}>Number of Votes {tmdbUrlDataSingle.vote_count}</span></div>
                                        <p>{tmdbUrlDataSingle.overview}</p>
                                        <div className="item__details__widget">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6">
                                                    <ul>
                                                        <li><span>Type:</span> Movie</li>
                                                        <li><span>Studios:</span> 
                                                            {tmdbUrlDataSingle.production_companies.map((studio) => (
                                                                <span key={studio.id}>&nbsp;<Badge pill bg="dark" text="light"><i className="bi bi-circle-half"></i>&nbsp;{studio.name}</Badge>&nbsp;</span>
                                                            ))
                                                            }
                                                        </li>
                                                        <li><span>Date aired:</span> Oct 02, 2019 to ?</li>
                                                        <li><span>Status:</span> Airing</li>
                                                        <li><span>Genre:</span>
                                                            {tmdbUrlDataSingle.genres.map((genre) => (
                                                                <a key={genre.id} href={"/search?type=movie&genre=" + genre.id}>&nbsp;<Badge pill bg="primary" text="light">{genre.name}</Badge></a>
                                                            ))}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="col-lg-6 col-md-6">
                                                    <ul>
                                                        <li><span>Available Languages & Quality:&nbsp;</span>
                                                        {mainUrlDataSingle.video_info.length > 0 ? mainUrlDataSingle.video_info.map((video_single_info) => (
                                                            <div key={video_single_info.id}><Badge pill bg="primary" text="light">{video_single_info.audio} - {video_single_info.quality}p</Badge>&nbsp;</div>
                                                        )) : <Badge key="1" pill bg="danger" text="light">No Sources Found</Badge>}
                                                        </li>
                                                        <li><span>Rating:</span> {mainUrlDataSingle.adult ? <Badge pill bg="danger" text="light">R</Badge> : <Badge pill bg="info" text="dark">PG</Badge>}</li>
                                                        <li><span>Duration:</span> 24 min/ep</li>
                                                        <li><span>Quality:</span> HD</li>
                                                        <li><span>Views:</span> 131,541</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <Modal show={show} onHide={handleClose} size="lg">
                        <Modal.Header className="trailer-modal-header" closeButton>
                            <Modal.Title>Trailer</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="trailer-modal-body">
                        <Ratio aspectRatio="16x9">
                            <iframe className="rounded" width="100%" src={"https://www.youtube.com/embed/" + tmdbUrlDataSingle.videos.results[0].key } title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </Ratio>
                        </Modal.Body>
                    </Modal>
                    <div id="video-container" className="video-container container">
                        { showResults ? 
                            <Plyr
                            options={options}
                            source={{
                                type: 'video',
                                title: 'Example title',
                                sources: [
                                    {
                                    src: `${mainUrlDataSingle.video_info[0].video_url}`,
                                    type: 'video/mp4',
                                    size: 1080,
                                    }
                                ]
                            }}
                        />
                        : <></>
                        }
                    </div>
                </Container>
            )}
        </div>
    )
}

export default SugoiMoviePage;
