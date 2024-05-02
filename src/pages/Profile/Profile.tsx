import React, { useEffect, useState, useContext } from 'react';
import './Profile.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import Carousel from '../../components/Carousel';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverURL } from '../../config';
import { UserState, unauthorizedUser } from '../../contexts/AuthContext/AuthContext';
import { useParams } from 'react-router-dom';
import { CarouselItemProps } from '../../components/Carousel/CarouselItem/CarouselItemProps';
import { SnackBarContext, defaultSnackBar, Severity } from '../../contexts/SnackBarContext';
import WorksFilteringPage from '../../components/WorksFilteringPage';


interface Loan {
    "id": number,
    "title": string,
    "isbn": string,
    "itemId": number,
    "loanedAt": Date,
}

interface ReturnedLoan extends Loan {
    "returnedAt": Date
}

const Profile: React.FC = () => {
    const { userId } = useParams()
    const { id, role } = useContext(AuthContext);
    const [user, setUser] = useState<UserState>(unauthorizedUser);
    const [myPage, setMyPage] = useState(false);
    const [triggerRefresh, setTriggerRefresh] = useState(false);
    const [loanItems, setLoanItems] = useState<{ unreturned: CarouselItemProps[], returned: CarouselItemProps[] }>({ unreturned: [], returned: [] });
    const { setSnackBar } = useContext(SnackBarContext);
    const [selectedSection, setSelectedSection] = useState<string>('Позики');

    const handleSectionClick = (section: string) => {
        setSelectedSection(section);
    }

    const openSnack = (severity: Severity, message: string) => {
        setSnackBar({ ...defaultSnackBar, open: true, severity: severity, message: message });
    }

    const fetchLoans = async (clause: string | undefined, size: number = 50) => {
        const returnClause = clause ? `${clause}/` : ''
        const userClause = userId ? `${userId}/` : ''

        const response = await axios.get(`${serverURL}/users/${userClause}loans/${returnClause}?size=${size}`, { withCredentials: true })
        return response.data.content
    }

    const returnLoan = async (loanId: number) => {
        try {
            await axios.post(`${serverURL}/loans/${loanId}/return/`, {}, { withCredentials: true })
            openSnack('success', 'Успішно повернено!');
        } catch (error: any) {
            openSnack('error', 'Помилка повернення');
        }
    }

    const returnLoanHandler = (loanId: number) => {
        returnLoan(loanId).then(() => setTriggerRefresh(prev => !prev));
    }

    useEffect(() => {
        fetchUser();

        const fetchAndSetLoans = async () => {
            const unreturnedLoans: Loan[] = await fetchLoans('unreturned');
            const returnedLoans: ReturnedLoan[] = await fetchLoans('returned');

            const returned: CarouselItemProps[] = returnedLoans.map(loan => ({
                src: `https://covers.openlibrary.org/b/isbn/${loan.isbn}-L.jpg?default=false`,
                alt: loan.title,
                description: loan.title,
                url: `/works/isbn/${loan.isbn}`,
            }))
            const unreturned: CarouselItemProps[] = unreturnedLoans.map(loan => {
                const baseProps = {
                    src: `https://covers.openlibrary.org/b/isbn/${loan.isbn}-L.jpg?default=false`,
                    alt: loan.title,
                    description: loan.title,
                    url: `/works/isbn/${loan.isbn}`,
                };
                return role === 'ADMIN'
                    ? { ...baseProps, onClick: () => returnLoanHandler(loan.id), label: 'Повернути' }
                    : baseProps;
            });

            setLoanItems({ unreturned: unreturned, returned: returned });
        };

        fetchAndSetLoans();
    }, [triggerRefresh]);

    const fetchUser = () => {
        let fetchIdClause
        if (userId) {
            fetchIdClause = `${userId}/`;
        } else {
            setMyPage(true);
            fetchIdClause = ''
        }
        if (userId && parseInt(userId) === id) {
            setMyPage(true);
        }
        axios.get(`${serverURL}/users/${fetchIdClause}`, { withCredentials: true }).then(response => setUser({ ...response.data }));
    }

    const handleLogOut = () => {
        axios.get(`${serverURL}/logout`, { withCredentials: true }).then(() => { })
        window.location.href = '/';
    }

    return (
        <>
            <Header />
            {user.firstName &&
                <div className='profile-container'>
                    <div className="profile-congatulation-container">
                        <h1 className="profile-congatulation">
                            {myPage ? `Вітаємо, ${user.firstName}!` : `${user.firstName} ${user.lastName}`}
                        </h1>
                        {!myPage ? '' :
                            <Button outlined noshadow onClick={handleLogOut}>
                                Вийти
                            </Button>
                        }
                    </div>
                    <section className="sections header-sections tabs-container">
                        <div className={`section-item ${selectedSection === 'Позики' ? 'selected-section' : ''}`} onClick={() => handleSectionClick('Позики')}>
                            Позики
                        </div>
                        <div className={`section-item ${selectedSection === 'Списки' ? 'selected-section' : ''}`} onClick={() => handleSectionClick('Списки')}>
                            Списки
                        </div>
                        <div className={`section-item ${selectedSection === 'Оцінки' ? 'selected-section' : ''}`} onClick={() => handleSectionClick('Оцінки')}>
                            Оцінки
                        </div>
                    </section>
                    {selectedSection === 'Позики' &&
                        <>
                            <div className='profile-page-section'>
                                <p className='section-title'>
                                    Взяті книжки
                                </p>
                                {!loanItems.unreturned.length ? <div className='empty-carousel'><u>Порожньо</u></div> :
                                    <Carousel items={loanItems.unreturned} />
                                }
                            </div>
                            <div className='profile-page-section'>
                                <p className='section-title'>
                                    Повернуті книжки
                                </p>
                                {!loanItems.returned.length ? <div className='empty-carousel'><u>Порожньо</u></div> :
                                    <Carousel items={loanItems.returned} />
                                }
                            </div>
                        </>
                    }
                    {selectedSection === 'Списки' &&
                        <div className='profile-page-section'>
                            <WorksFilteringPage
                                showHeader={false}
                                userId={userId ? parseInt(userId) : id}
                                listings
                                availability={false}
                            />
                        </div>
                    }
                    {selectedSection === 'Оцінки' &&
                        <div className='profile-page-section'>
                            <WorksFilteringPage
                                showHeader={false}
                                userId={userId ? parseInt(userId) : id}
                                ratings
                                availability={false}
                            />
                        </div>
                    }
                </div>
            }
            <Footer />
        </>
    );
}
export default Profile;