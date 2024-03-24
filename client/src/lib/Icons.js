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
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import LaptopIcon from '@mui/icons-material/Laptop';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SchoolIcon from '@mui/icons-material/School';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';


const Icon = (props) => {
    switch (props.icon) {
        case 'LayersIcon': return <LayersIcon style={props.style} />
        case 'TranslateIcon': return <TranslateIcon style={props.style} />
        case 'FastfoodIcon': return <FastfoodIcon style={props.style} />
        case 'SportsEsportsIcon': return <SportsEsportsIcon style={props.style} />
        case 'FavoriteIcon': return <FavoriteIcon style={props.style} />
        case 'BrushIcon': return <BrushIcon style={props.style} />
        case 'LocalAirportIcon': return <LocalAirportIcon style={props.style} />
        case 'LocalGroceryStoreIcon': return <LocalGroceryStoreIcon style={props.style} />
        case 'MusicNoteIcon': return <MusicNoteIcon style={props.style} />
        case 'RocketLaunchIcon': return <RocketLaunchIcon style={props.style} />
        case 'FreeBreakfastIcon': return <FreeBreakfastIcon style={props.style} />
        case 'LaptopIcon': return <LaptopIcon style={props.style} />
        case 'LightbulbIcon': return <LightbulbIcon style={props.style} />
        case 'SchoolIcon': return <SchoolIcon style={props.style} />
        case 'AutoStoriesIcon': return <AutoStoriesIcon style={props.style} />
        default: return <LayersIcon style={props.style} />
    }
}

export { Icon }
