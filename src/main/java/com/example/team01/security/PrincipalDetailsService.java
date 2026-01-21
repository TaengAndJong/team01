package com.example.team01.security;

import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;



@Slf4j
@Service
public class PrincipalDetailsService implements UserDetailsService  {

    private  LoginDao loginDao;

    public PrincipalDetailsService(LoginDao loginDao) {
        this.loginDao = loginDao;
    }


    // 프론트에서 로그인을 통해 clientid가 넘어옴 --> 컨트롤러에서 어떻게 해야 사용해지는가?
    //userDetailsImple을 사용해야 할 것같은데
    @Override
    public  UserDetails loadUserByUsername(String clientId) throws UsernameNotFoundException {
        log.info("loadUserByUsername에 진입 clientId:{}",clientId);

        //아이디 미입력 검증 --> 빈 값을 넘어올 경우 성공인증 방지코드
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
        userData.setClientId(loginUser.getClientId());
        userData.setPassword(loginUser.getPassword());
        userData.setIdentiNum(loginUser.getIdentiNum());
        userData.setRoleId(loginUser.getRoleId());

       log.info("user 데이터로 userDetails객체 생성----로그인 정보 설정완료 :{}",userData);
        
        //인증객체에 userData 담아서 반환
        return new PrincipalDetails(userData);

    }
//end

}
