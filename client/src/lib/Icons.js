import React from "react";

import LayersIcon from "@mui/icons-material/Layers";
import TranslateIcon from '@mui/icons-material/Translate';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BrushIcon from '@mui/icons-material/Brush';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


const Icon = (props) => {
    switch (props.icon) {
        case 0 || 'LayersIcon': return <LayersIcon style={props.style} />
        case 1 || 'TranslateIcon': return <TranslateIcon style={props.style} />
        case 2 || 'FastfoodIcon': return <FastfoodIcon style={props.style} />
        case 3 || 'SportsEsportsIcon': return <SportsEsportsIcon style={props.style} />
        case 4 || 'FavoriteIcon': return <FavoriteIcon style={props.style} />
        case 5 || 'BrushIcon': return <BrushIcon style={props.style} />
        case 6 || 'LocalAirportIcon': return <LocalAirportIcon style={props.style} />
        case 7 || 'LocalGroceryStoreIcon': return <LocalGroceryStoreIcon style={props.style} />
        case 8 || 'MusicNoteIcon': return <MusicNoteIcon style={props.style} />
        case 9 || 'RocketLaunchIcon': return <RocketLaunchIcon style={props.style} />
        default: return <LayersIcon style={props.style} />
    }
}

export { Icon }
