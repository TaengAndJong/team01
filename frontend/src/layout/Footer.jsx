import React from 'react';

const Footer = () => {
    return (
        <footer id="footer" className="footer">
            <div className="footer-inner">
                <ul className="footer-info de-flex ">
                    <li className="d-inline-flex">
                        <a href="#" className="link">개인정보처리방침</a>
                    </li>
                    <li className="d-inline-flex">
                        <a href="#" className="link">이용약관</a>
                    </li>
                    <li className="d-inline-flex">
                        <a href="#" className="link">원격저장소</a>
                    </li>
                    <li className="d-inline-flex">
                        <a href="#" className="link">김태은</a>
                    </li>
                </ul>
                <p className="copyright">Copyright 2025 taeeun All Rights reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
