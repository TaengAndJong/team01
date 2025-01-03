import { useDaumPostcodePopup } from 'react-daum-postcode';

const DaumPostcode  = ({ onAddressSelect }) => {
    const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'; // 스크립트 URL 추가
    const open = useDaumPostcodePopup(scriptUrl);

    const handleComplete = (data) => {
        console.log("data------",data);
        let addressObject ={}
        //let zonecode = data.zonecode;
        //let fullAddress = data.address;
        let extraAddress = '';
    
        // addressObject 에 address, zoncode 담기
        addressObject.fullAddress = data.address;
        addressObject.zonecode = data.zonecode;
        console.log("Address---",addressObject);

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

        console.log("addressObject---------",addressObject); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
        onAddressSelect(addressObject); // 부모 컴포넌트로 데이터 전달

    };

    const handleClick = () => {
        open({ onComplete: handleComplete });
    };

    return (
        <button type='button' onClick={handleClick}>
            주소 찾기
        </button>
    );
};

export default DaumPostcode;