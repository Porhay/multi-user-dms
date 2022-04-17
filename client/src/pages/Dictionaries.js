import React from 'react'
import {Container} from "react-bootstrap";

import Dictionaries from "../components/Dictionaries";


const DictionariesPage = () => {
    return (
        <Container className="d-flex flex-column mt-3">
            <Dictionaries />
        </Container>
    )
}

export default DictionariesPage
