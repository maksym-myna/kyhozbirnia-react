import React, { SetStateAction, Dispatch } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import './SplitButton.css';
import { ListingType } from '../FilteringSideBar';

const options = ['Хочу прочитати', 'Читаю', 'Прочитав'];

interface SplitButtonProps {
    onClick: (value: ListingType) => void;
    statuses: ListingType[];
}

const SplitButton: React.FC<SplitButtonProps> = ({ onClick, statuses }) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const optionsMapping: { [key: string]: ListingType } = {
        'Хочу прочитати': 'WANT_TO_READ',
        'Читаю': 'CURRENTLY_READING',
        'Прочитав': 'ALREADY_READ'
    }

    const indexToOption = (index: number) => optionsMapping[options[selectedIndex]];

    const handleClick = () => {
        onClick(indexToOption(selectedIndex));
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    return (
        <React.Fragment>
            <ButtonGroup
                className='split-button-container'
                variant="contained"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
            >
                <Paper className="paper" onClick={handleClick}>
                    {statuses.includes(optionsMapping[options[selectedIndex]]) ?
                        <CheckBoxOutlinedIcon sx={{ fill: "var(--primary-color)", height: "1.75rem", width: "1.75rem", padding: "0 0 0 1rem" }} /> :
                        <CheckBoxOutlineBlankIcon sx={{ fill: "var(--primary-color)", height: "1.75rem", width: "1.75rem", padding: "0 0 0 1rem" }} />
                    }
                </Paper> <Button className="split-button" onClick={handleClick}>{options[selectedIndex]}</Button>
                <Button
                    className="dropdown-button"
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{
                    zIndex: 100,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            selected={index === selectedIndex}
                                            onClick={(event) => handleMenuItemClick(event, index)}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}

export default SplitButton;