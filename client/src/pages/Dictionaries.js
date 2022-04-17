import React from 'react'
import {Container} from "react-bootstrap";

import Dictionaries from "../components/Dictionaries";
// import Entries from "../components/Entries";


const DictionariesPage = () => {
    return (
        <Container className="d-flex flex-column mt-3">
            <Dictionaries />
            {/*<Entries />*/}
        </Container>
    )
}

export default DictionariesPage
