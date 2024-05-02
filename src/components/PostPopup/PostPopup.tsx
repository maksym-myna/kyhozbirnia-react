import React, { useContext, useState } from 'react';
import Popup from '../Popup';
import ToggleButtonGroup from '../ToggleButtonGroupComponent';
import BookIcon from '@mui/icons-material/Book';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import HeadsetIcon from '@mui/icons-material/Headset';
import SearchBar from '../SearchBar';
import Button from '../Button';
import ChipContainer from '../ChipContainer';
import { WorksContext, WorksState, initialState } from '../../contexts/WorksContext';
import { SnackBarContext, defaultSnackBar, Severity } from '../../contexts/SnackBarContext';

import axios from 'axios';
import { serverURL } from '../../config';
import './PostPopup.css';
import { Medium } from '../FilteringSideBar';

interface NameRequest {
    name: string;
}

interface IdRequest {
    id: string;
}

interface WorkRequest {
    title: string,
    isbn: string,
    releaseYear: number,
    pages: number,
    weight: number,
    quantity: number,
    medium: Medium,
    language: IdRequest,
    publisher: NameRequest,
    authors: NameRequest[],
    subjects: NameRequest[]
}

interface PostPopupProps {
    title: string;
    togglePopup: () => void;
    destination: string
}

const PostPopup: React.FC<PostPopupProps> = ({ title, togglePopup, destination }) => {

    const [medium, setMedium] = useState<Medium>("BOOK");
    const [name, setName] = useState("");
    const [isbn, setIsbn] = useState("");
    const [pages, setPages] = useState("");
    const [weight, setWeight] = useState("");
    const [copies, setCopies] = useState("");
    const [publisherInput, setPublisherInput] = useState("");
    const [authorInput, setAuthorInput] = useState("");

    const [workState, setState] = useState<WorksState>({ ...initialState });
    const unsetState = () => setState({ ...initialState });

    const { setSnackBar } = useContext(SnackBarContext);

    const openSnack = (severity: Severity, message: string) => {
        setSnackBar({ ...defaultSnackBar, open: true, severity: severity, message: message });
    }

    const handleMedium = (
        event: React.MouseEvent<HTMLElement>,
        newMedium: 'BOOK' | 'EBOOK' | 'AUDIOBOOK' | null,
    ) => {
        newMedium && setMedium(newMedium);
    };

    const validateInput = () => {
        if (!name) {
            setSnackBar({ ...defaultSnackBar, open: true, severity: 'error', message: 'Назва не може бути порожньою' });
            return false;
        }

        const isbnRegex = /^(?:\d{9}X|\d{10}|\d{13})$/; // Regex for ISBN validation

        if (destination !== 'works')
            return true;


        if (!isbnRegex.test(isbn)) {
            setSnackBar({ ...defaultSnackBar, open: true, severity: 'error', message: 'ISBN може містити 13-чисельні символи або ж останньою літеру X' });
            return false;
        }

        if (parseInt(pages) <= 0) {
            setSnackBar({ ...defaultSnackBar, open: true, severity: 'error', message: 'Сторінок має бути більшою за 0' });
            return false;
        }

        if (parseInt(weight) <= 0) {
            setSnackBar({ ...defaultSnackBar, open: true, severity: 'error', message: 'Вага має бути більшою за 0' });
            return false;
        }

        if (parseInt(copies) < 0) {
            setSnackBar({ ...defaultSnackBar, open: true, severity: 'error', message: 'Кількість копій має бути більшою або рівною 0' });
            return false;
        }

        if (!workState.languages?.length) {
            setSnackBar({ ...defaultSnackBar, open: true, severity: 'error', message: 'Мова не може бути порожньою' });
            return false;
        }
        if (!workState.publishers?.length) {
            setSnackBar({ ...defaultSnackBar, open: true, severity: 'error', message: 'Видавець не може бути порожнім' });
            return false;
        }
        if (!workState.subjects?.length) {
            setSnackBar({ ...defaultSnackBar, open: true, severity: 'error', message: 'Жанр не може бути порожнім' });
            return false;
        }

        return true;
    }

    const handlePost = async () => {
        if (!workState.publishers.length) {
            workState.publishers.push(publisherInput);
        }
        if (!workState.authors.length) {
            workState.authors.push(authorInput);
        }

        if (!validateInput()) {
            return false
        }

        let body: NameRequest | WorkRequest;
        try {
            if (destination === 'works') {
                const languageResponse = await axios.get(`${serverURL}/languages/name/${workState.languages[0]}/`);
                const langId = languageResponse.data.id

                body = {
                    title: name,
                    isbn: isbn,
                    releaseYear: new Date().getFullYear(),
                    pages: parseInt(pages),
                    weight: parseInt(weight),
                    quantity: parseInt(copies),
                    medium: medium,
                    language: { id: langId },
                    publisher: { name: workState.publishers[0] },
                    authors: workState.authors.map(author => ({ name: author })),
                    subjects: workState.subjects.map(subject => ({ name: subject }))
                }

                console.log(body);
            } else {
                body = { name: name }
            }
            const res = await axios.post(`${serverURL}/${destination}/`, body, { withCredentials: true });
            openSnack('success', 'Успішно додано!');
        } catch (error: any) {
            console.log(error.response);
            openSnack('error', error.response.data.error);
        }
        unsetState()
        togglePopup()
    }

    return (
        <WorksContext.Provider value={{ ...workState, setState }}>
            <Popup title={title} togglePopup={togglePopup}>
                <div className='popup-options-container'>
                    {destination === 'works' &&
                        <ToggleButtonGroup<Medium>
                            options={[
                                { value: 'BOOK', IconComponent: BookIcon, label: 'Папір' },
                                { value: 'EBOOK', IconComponent: TabletMacIcon, label: 'Е-книга' },
                                { value: 'AUDIOBOOK', IconComponent: HeadsetIcon, label: 'Авдіо' },
                            ]}
                            value={medium as Medium}
                            onChange={handleMedium}
                        />
                    }
                    <div className='input-container popup-input'>
                        <input type="text" placeholder="Назва" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    {destination === 'works' && <>
                        <div className='input-container popup-input'>
                            <input type="text" placeholder="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
                        </div>
                        <div className='input-container popup-input'>
                            <input type="number" placeholder="Сторінок" value={pages} onChange={(e) => setPages(e.target.value)} />
                        </div>
                        <div className='input-container popup-input'>
                            <input type="number" placeholder="Вага" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                        <div className='input-container popup-input'>
                            <input type="text" placeholder="Кількість копій" value={copies} onChange={(e) => setCopies(e.target.value)} />
                        </div>

                        <SearchBar placeholder='Мова' searchType='languages' maxValues={1}></SearchBar>
                        {workState.languages?.length !== 0 && <ChipContainer type='languages' />}
                        <SearchBar placeholder='Видавець' searchType='publishers' maxValues={1} onValueChange={setPublisherInput}></SearchBar>
                        {workState.publishers?.length !== 0 && <ChipContainer type='publishers' />}
                        <SearchBar placeholder='Жанр' searchType='subjects'></SearchBar>
                        {workState.subjects?.length !== 0 && <ChipContainer type='subjects' />}
                        <SearchBar placeholder='Автор' searchType='authors' authorsRedirect={false} onValueChange={setAuthorInput}></SearchBar>
                        {workState.authors?.length !== 0 && <ChipContainer type='authors' />}
                    </>}
                </div>
                <div className='popup-botton'>
                    <Button width="60%" inverted onClick={handlePost}>
                        Додати
                    </Button>
                </div>
            </Popup>
        </WorksContext.Provider>
    )
}

export default PostPopup;
