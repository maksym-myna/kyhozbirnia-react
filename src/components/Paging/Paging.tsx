import React from "react";
import Button from "../Button";
import { WorksContext } from "../../contexts/WorksContext/WorksContext";
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import './Paging.css';

interface PagingProps {
    first: boolean;
    last: boolean;
    page: number;
    goBack: () => void;
    goForward: () => void;
}

const Paging: React.FC<PagingProps> = ({ first, last, page, goForward, goBack }) => {
    return (
        <div className="paging">
            <Button
                inverted
                disabled={first}
                onClick={goBack}
            >
                <WestIcon />
                Назад
            </Button>
            <Button
                inverted
                disabled={last}
                onClick={goForward}
            >
                Далі
                <EastIcon />
            </Button>
        </div>
    );
}

export default Paging;