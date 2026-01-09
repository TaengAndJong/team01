import { useDaumPostcodePopup } from 'react-daum-postcode';

const DaumPostcode  = ({ onAddressSelect }) => {
    const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'; // 스크립트 URL 추가
    const open = useDaumPostcodePopup(scriptUrl);

    const handleComplete = (data) => {

        let addressObject ={}
        //let zonecode = data.zonecode;
        //let fullAddress = data.address;
        let extraAddress = '';
    
        // addressObject 에 address, zoncode 담기
        addressObject.fullAddress = data.address;
        addressObject.zonecode = data.zonecode;


        //bname = xx동 
        //buildingName = 아파트명
        //zoneCode = 우편번호
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            addressObject.fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        onAddressSelect(addressObject); // 부모 컴포넌트로 데이터 전달

    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <button type='button' id="find-addr-btn" className="btn custom-btn01 form-control w-auto ms-1 py-2" onClick={handleClick}>
            주소 찾기
        </button>
    );
};

export default DaumPostcode;