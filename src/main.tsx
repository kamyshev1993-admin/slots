import {createRoot} from 'react-dom/client'
import Slots from './SlotsApp.tsx';
import {StrictMode} from "react";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Slots/>
    </StrictMode>
)
