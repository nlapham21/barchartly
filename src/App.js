import React, { Component } from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap'

import ChartWrapper from './ChartWrapper';
import GenderDropdown from './GenderDropdown';

class App extends Component {
    state = {
        gender: 'men'
    }

    genderSelected = (gender) => this.setState({ gender });

    render() {
        return (
            <div className="App">
                <Navbar bg="light">
                    <Navbar.Brand>Barchartly</Navbar.Brand>
                </Navbar>
                <Container>
                    <Row>
                        <Col xs={12}><GenderDropdown genderSelected={this.genderSelected}/></Col>
                    </Row>
                    <Row>
                        <Col xs={12}><ChartWrapper /></Col>
                    </Row>
                </Container>
            </div>
          );
    }
}

export default App;
