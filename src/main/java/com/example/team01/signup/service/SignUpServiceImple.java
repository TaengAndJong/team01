package com.example.team01.signup.service;


import com.example.team01.common.exception.signup.EmailException;
import com.example.team01.common.exception.signup.IdException;
import com.example.team01.common.exception.signup.PasswordException;
import com.example.team01.common.exception.signup.PhoneNumberException;
import com.example.team01.signup.dao.SignUpDao;
import com.example.team01.signup.dto.staff.StaffConfirmRequest;
import com.example.team01.vo.SignUpVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Slf4j
@RequiredArgsConstructor // 생성자 주입
@Service
public class SignUpServiceImple implements SignUpService {
    
    /*
    * dao를 final로 선언하면 처음 주입받은 Dao 객체의 참고가 변경되지 않도록 보장 됨 (고정된 Dao를 참조)
    * 주입받은 dao 를 서비스구현체 생성자의 파라미터로 주입하는 방식을 생성자 주입방식이라고 함
    *
    * 생성자 주입방식을 사용하는 이유는
    * 의존성이 누락(dao 객체의 누락)된 상태로 객체가 생성되는 것을 막아
    * 에러를 빠르게 발견할 수 있어 유지보수에 유리
    *
    * */

    /*
    * 서비스 구현체의 역할
    * 글로벌 핸들러와 커스텀 예외처리를 구성해 처리를 하는 경우,
    * 서비스 구현체의 역할은 
    * 1) 비즈니스 규칙(로직)을 판단하고 2) 컨트롤러로 예외처리를 던져 줌 3) 정상 규칙(로직)만 실행
    * */

    private final SignUpDao dao;

    // mybatis는 insert, delete, update는 성공 여부 숫자 1로 반환
    // 디비 조회에 대한 성공여부는 서비스에서만 판단기준으로만 사용
    @Override
    public void insertUserData(SignUpVO signUpVO) {
        log.info("회원가입 데이터 insert 메서드 진입");
        int cnt; // 성공여부 담을 변수
        if (signUpVO == null) {
            // 객체 (clientId , tel 등 회원가입 객체들이 존재하고 그의 값이 null 일 경우에 예외에 안걸림)
            //넘어온 파라미터가 잘못되었을 경우 : 1)  null이면 안되는 값이 null
            throw new IllegalArgumentException("회원 정보가 없습니다.");
        }
        
        //객체에 대해 세부적인 null값과 빈값 검증 필요
        if(signUpVO.getClientId() == null || signUpVO.getClientId().isBlank()){
            throw new IdException("아이디는 필수입니다.");
        }

        if(signUpVO.getPassword() == null || signUpVO.getPassword().isBlank()){
            throw new PasswordException("비밀번호는 필수입니다.");
        }

        if(signUpVO.getEmail() == null || signUpVO.getEmail().isBlank()){
            throw new EmailException("이메일은 필수입니다.");
        }

        // signUpVO 객체가 있으면 디비에 저장될 데이터에 대한 검증을  서버에서 확인 필요
        if(dao.selectDuplicatePhoneNumber(signUpVO.getTel()) > 0){
            throw new PhoneNumberException("이미 사용중인 전화번호입니다.");
        }

        if(dao.selectDuplicateEmail(signUpVO.getEmail()) > 0){
            throw new EmailException("이미 사용중인 이메일입니다.");
        }

        cnt = dao.insertUserData(signUpVO);
        log.info("insert cnt :{}",cnt);
        if (cnt != 1) {
            //정상값을 입력했지만 처리과정 중 실패했을 경우
            throw new RuntimeException("회원가입 저장 실패");
        }
    }

    // 반환값 필요 없음, 서비스에서 판단하기때문에 컨트롤러로 예외만 던짐
    // 빈 값을 먼저 검증하는 이유는 디비까지 조회하는 불필요한 과정을 생략하기 위해서
    @Override
    public void selectDuplicateId(String clientId) {
        log.info("아이디 중복 검증 메서드 진입: {}", clientId );
        //1) 존재 검증 : 아이디 빈 값 검증
        if(clientId == null || clientId.isEmpty()){
            throw new IdException("아이디는 필수입니다.");
        }

        //2) 중복 검증 :  검증할 아이디 객체가 존재하면, 아이디 조회
        int cnt =  dao.selectDuplicateId(clientId);
        log.info("아이디 중복 검증 결과 반환: {}", cnt );
        if(cnt > 0){ // 중복결과값이 1이라면
            //중복 예외를  컨트롤러로 던져줌
            throw new IdException("중복된 아이디입니다.");
        }
    }

       @Override
    public void selectStaffId(StaffConfirmRequest staff) {

        log.info("staff-------------- 사원 정보:{}", staff);

//컨트롤러에서 받아온 파라미터 dao로 전달, 반환값이 1이면 존재, 아니면 0 인데 예외처리해야함?

           dao.selectStaffInfo(staff);

    }


}
