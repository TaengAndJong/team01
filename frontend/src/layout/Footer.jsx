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
                        <a href="#" className="link">원격저장소</a>
                    </li>
                    <li className="d-inline-flex">
                        <a href="#" className="link">김태은</a>
                    </li>
                    <li className="d-inline-flex">
                        <a href="#" className="link">김종호</a>
                    </li>
                </ul>
                <div className="logo footer-logo">
                    <span className="sr-only">the book 로고</span>
                </div>
                <ul className="footer-info d-flex">
                    <li className="d-inline-flex first">
                        <span className="f-tit">주소</span>대전광역시 도서로 도서길 13-4번지
                    </li>
                    <li className="d-inline-flex second">
                        <span className="f-tit">사업자등록번호</span>123-44-05321
                    </li>
                    <li className="d-inline-flex third">
                        <span className="f-tit">대표전화</span>123-44-05321
                    </li>
                    <li className="d-inline-flex fourth">
                        <span className="f-tit">FAX</span>1234-543-5411
                    </li>

                </ul>
                <p className="copyright">Copyright 2025 THEBOOK.ALL RIGHTS RESERVED</p>
            </div>
        </footer>
    );
};

export default Footer;
