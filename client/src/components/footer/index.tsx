import React from 'react';
import './footer.css';

const Footer = (props:any) => {
    return (
        <footer className="footer-wrapper">
            <div className="container">
                <div className="row footer">
                    <div className="col-md-6">
                        <span>© 2021 ASSISTANT - система менеджменту проектів та завдань</span>
                    </div>
                    <div className="col-md-3 lider">
                        <a target='_blank' href="https://lider.diit.edu.ua/">LIDER</a>
                    </div>
                    <div className="col-md-3 callback">
                        <a target='_blank' href="mailto:justrelaxdc@gmail.com">Зворотній зв'язок</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
