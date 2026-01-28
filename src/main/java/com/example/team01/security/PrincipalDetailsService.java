package com.example.team01.security;

import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/*
* 사용자정보를 DB에서 조회해오는 인터페이스로 loadUserByUsername(username)의 단일 메서드를 가지고 있음
* */

@Slf4j
@RequiredArgsConstructor //해당 롬복어노테이션을 사용하면 생성자를 직접 작성할 필요 없음
@Service
public class PrincipalDetailsService implements UserDetailsService  {
    //조회해오기 위한 Dao 불러오기
    private final LoginDao loginDao;
    
    // public PrincipalDetailsService(LoginDao loginDao) {
    //     this.loginDao = loginDao;
    // }
    
    // 프론트의 로그인 요청을 통해 사용자정보인 clientid가 넘어오고,
    @Override
    public  UserDetails loadUserByUsername(String clientId) throws UsernameNotFoundException {
        log.info("loadUserByUsername에 진입 clientId:{}",clientId);

        //아이디 미입력 검증 --> 빈 값을 넘어올 경우 성공 인증 방지코드
        if (clientId == null || clientId.trim().isEmpty()) {
            log.info("아이디 미입력 예외 검증 진입");
            //아이디/비밀번호 미입력 예외
            throw new AuthenticationServiceException("아이디 미입력");
        }

        //입력된 아이디 값이 있다면, 해당아이디에 대한 정보를 디비에서 조회
        LoginVO loginUser = loginDao.selectClientId(clientId);
        log.info("디비에 해당 아이디 조회:{}",loginUser);
       //4. 디비에서 조회한 후 해당 아이디가 없을 때
        if (loginUser == null) {
            log.info("디비에 조회목록에 없다면 :{}",loginUser);
            //존재하지않는 사용자 예외
            throw new UsernameNotFoundException("clientId를 찾을 수 없습니다.: " + clientId);
        }
    
        
        //디비에서 조회해온 user 데이터로 userDetails객체 생성
        LoginVO userData = new LoginVO();
        log.info("userData --- principalDtailService",userData);

        userData.setClientId(loginUser.getClientId()); //아이디
        userData.setPassword(loginUser.getPassword());//비밀번호
        userData.setClientName(loginUser.getClientName());// 사용자명
        userData.setRoleId(loginUser.getRoleId()); // 역할 아이디
        userData.setRoleName(loginUser.getRoleName());// 역할 명
      //  userData.setIdentiNum(loginUser.getIdentiNum());  회원번호 보류


       log.info("user 데이터로 userDetails객체 생성----로그인 정보 설정완료 :{}",userData);
        
        //인증객체에 userData 담아서 반환
        return new PrincipalDetails(userData);

    }
//end

}
