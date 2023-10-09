import Carousel from 'react-bootstrap/Carousel';


function Carusel() {
    return (
        <Carousel className={"w-9/12 mb-10"}>
            <Carousel.Item>
                <img className={"rounded-2xl"} src={"https://s1.1zoom.ru/big0/360/Skyscrapers_Roads_Houses_458779.jpg"}/>
                <Carousel.Caption>
                    <h3>1</h3>
                    <p>1</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img className={"rounded-2xl"} src={"https://s1.1zoom.ru/big0/360/Skyscrapers_Roads_Houses_458779.jpg"}/>
                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img className={"rounded-2xl"} src={"https://s1.1zoom.ru/big0/360/Skyscrapers_Roads_Houses_458779.jpg"}/>
                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default Carusel;