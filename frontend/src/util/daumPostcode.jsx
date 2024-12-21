import { useDaumPostcodePopup } from 'react-daum-postcode';

const DaumPostcode  = ({ onAddressSelect }) => {
    const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'; // 스크립트 URL 추가
    const open = useDaumPostcodePopup(scriptUrl);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
        onAddressSelect(fullAddress); // 부모 컴포넌트로 데이터 전달
    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <button type='button' onClick={handleClick}>
            우편번호 찾기
        </button>
    );
};

export default DaumPostcode;