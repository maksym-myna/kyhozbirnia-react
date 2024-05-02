import React, { useContext, useEffect, useRef, useState } from "react";
import './WorkByIsbn.css';
import { useParams } from "react-router-dom";
import { ListingType, Medium } from "../../components/FilteringSideBar";
import { serverURL } from "../../config";
import Cover from "../../components/Cover";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "../../components/Link";
import InfoPlane from "../../components/InfoPlane";
import { Rating, Typography } from "@mui/material";
import Button from "../../components/Button";
import SplitButton from "../../components/SplitButton";
import axios from "axios";
import { defaultSnackBar, Severity, SnackBarContext } from "../../contexts/SnackBarContext";
import PostPopup from "../../components/PostPopup";
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from "../../contexts/AuthContext";
interface IdNameResponse {
    id: string;
    name: string;
}

export interface Work {
    id: number;
    title: string;
    pages: number;
    releaseYear: number;
    isbn: string;
    medium: Medium;
    weight: number;
    modifiedAt: Date;
    publisher: IdNameResponse;
    language: IdNameResponse;
    authors: Set<string>;
    subjects: Set<string>;
    currentlyReading: number;
    wantToRead: number;
    alreadyRead: number;
    rating: number;
    scored: number;
    copies: number;
    availableCopies: number;
}

const WorkByIsbn: React.FC = () => {
    const { role } = useContext(AuthContext);
    const { isbn } = useParams<{ isbn: string }>();
    const [work, setWork] = React.useState<any>();
    const [statuses, setStatuses] = React.useState<ListingType[]>([]);
    const { setSnackBar } = useContext(SnackBarContext);
    const [refreshTrigger, setRefreshTrigger] = React.useState(false);
    const [listingTrigger, setListingTrigger] = React.useState(false);
    const [listingStatus, setListingStatus] = React.useState<ListingType>('WANT_TO_READ');
    const initialRender = useRef(0);
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    const openSnack = (severity: Severity, message: string) => {
        setSnackBar({ ...defaultSnackBar, open: true, severity: severity, message: message });
    }

    const ListingHandler = (value: ListingType) => {
        setListingStatus(value)
        setListingTrigger(prev => !prev);
    }

    useEffect(() => {
        const fetchWork = async () => {
            try {
                const response = await fetch(`${serverURL}/works/isbn/${isbn}/`, { credentials: 'include' });
                const data = await response.json();
                setWork(data);

                const statusesResponse = await fetch(`${serverURL}/users/listings/${data.id}/`, { credentials: 'include' });
                const statusesData = await statusesResponse.json();

                let statuses: ListingType[] = [];
                if (statusesData.wantToRead?.length) {
                    statuses.push('WANT_TO_READ');
                }
                if (statusesData.reading?.length) {
                    statuses.push('CURRENTLY_READING');
                }
                if (statusesData.alreadyRead?.length) {
                    statuses.push('ALREADY_READ');
                }
                setStatuses(statuses);

            } catch (error: any) {
                console.error('Failed to fetch work:', error.message);
            }
        };

        fetchWork();
    }, [refreshTrigger]);

    const rateWork = async (event: React.ChangeEvent<{}>, value: number | null) => {
        if (role === 'UNAUTHORIZED') {
            return
        }
        try {
            if (!value) return;
            const body = {
                workId: work.id,
                score: value
            }
            await axios.post(`${serverURL}/ratings/`, body, { withCredentials: true });
            openSnack('success', 'Успішно оцінено!');
            setRefreshTrigger(prev => !prev);
        } catch (error: any) {
            openSnack('error', error.response.data.error);
        }
    }

    useEffect(() => {
        if (role === 'UNAUTHORIZED') {
            return
        }
        if (initialRender.current < 2) {
            initialRender.current++;
        } else {
            const fetchData = async () => {
                try {
                    if (statuses.includes(listingStatus)) {
                        const params = {
                            workId: work.id,
                            status: listingStatus
                        }
                        await axios.delete(`${serverURL}/listings/`, { params: params, withCredentials: true });
                        openSnack('success', 'Успішно видалено зі списку!');
                    } else {
                        const body = {
                            workId: work.id,
                            status: listingStatus
                        }
                        await axios.post(`${serverURL}/listings/`, body, { withCredentials: true });
                        openSnack('success', 'Успішно додано до списку!');
                    }
                    setRefreshTrigger(prev => !prev);
                } catch (error: any) {
                    openSnack('error', error.response.data.error);
                }
            };
            fetchData();
        }
    }, [listingTrigger]);

    const loanWork = async () => {
        try {
            await axios.post(`${serverURL}/loans/${work.id}/`, {}, { withCredentials: true });
            openSnack('success', 'Успішно замовлено!');
            setRefreshTrigger(prev => !prev);
        } catch (error: any) {
            openSnack('error', error.response.data.error);
        }
    }

    return (
        <>
            <Header currentPage='works' postButton={false} />
            {work &&

                <div className="work-container">
                    <section className="main-work-info-container">

                        {<Cover height="24rem" width="20rem" src={`https://covers.openlibrary.org/b/isbn/${work.isbn}-L.jpg?default=false`} alt={`${work.title} cover art`} roundBorders />}
                        <div className="work-info">
                            <section className="work-title">
                                {work.title.slice(0, 75) + (work.title.length > 75 ? '...' : '')}
                            </section>
                            <section className="work-subtitle">
                                <span className='book-info-one-liner'>
                                    {work.releaseYear} · {<Link to={`/publishers/${work.publisher.name}`}> {work.publisher.name} </Link>} · {work.medium == 'BOOK' ? 'Папір' : work.medium == 'AUDIO' ? 'Авдіо' : 'Електронна'} · {work.pages}с.
                                </span>
                                {
                                    role === 'ADMIN' &&
                                    <EditIcon className='edit-icon' onClick={togglePopup} />
                                }
                            </section>
                            <section className="work-list-items">
                                {work.authors.slice(0, 4).join(', ').split(',').map((author: string, index: number) => (
                                    <React.Fragment key={index}>
                                        <Link className="work-list-item" to={`/authors/${author.trim()}`}><i>{author.trim()}</i></Link>
                                        {index < work.authors.length - 1 && ', '}
                                    </React.Fragment>
                                ))}
                            </section>
                            <section className="work-list-items">
                                {work.subjects.slice(0, 4).join(', ').split(',').map((subject: string, index: number) => (
                                    <React.Fragment key={index}>
                                        <Link className="work-list-item" to={`/subjects/${subject.trim()}`}><b>{subject.trim()}</b></Link>
                                        {index < work.subjects.length - 1 && ', '}
                                    </React.Fragment>
                                ))}
                            </section>
                            <div className='hero-book-rating'>
                                <Typography component="legend">
                                    {work.scored} оцінок
                                </Typography>
                                <Rating
                                    name="book-rating"
                                    onChange={rateWork}
                                    // readOnly
                                    value={work.rating}
                                />
                            </div>
                            {role === 'ADMIN' || role === 'USER' ?
                                <div className="work-buttons-container">
                                    <div className="loan-container">
                                        <div className="copies-left">
                                            Одиниць залишилось: {work.availableCopies}
                                        </div>
                                        <Button onClick={loanWork} inverted noshadow disabled={work.availableCopies === 0}>
                                            Замовити
                                        </Button>
                                    </div>
                                    <SplitButton onClick={ListingHandler} statuses={statuses} />
                                </div>
                                :
                                <div className="login-to-see">
                                    Увійдіть для розблокування повного функціоналу!
                                </div>
                            }
                        </div>
                    </section>

                    <section className="work-info-planes">
                        <InfoPlane outline header="ISBN" content={work.isbn} />
                        <InfoPlane outline header="Мова" content={work.language.name} />
                        <InfoPlane outline header="На руках" content={work.copies - work.availableCopies} />
                        <InfoPlane outline header="Читають" content={work.currentlyReading} />
                        <InfoPlane outline header="Прочитали" content={work.alreadyRead} />
                        <InfoPlane outline header="Хочуть" content={work.wantToRead} />
                    </section>
                </div>
            }
            {showPopup && <PostPopup title={"Редагувати книжку"} togglePopup={togglePopup} destination={"works"} method="put" data={work} />}
            <Footer />
        </>
    )
}

export default WorkByIsbn;