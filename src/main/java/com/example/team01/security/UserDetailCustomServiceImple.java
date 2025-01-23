package com.example.team01.security;

import com.example.team01.login.dao.LoginDao;
import com.example.team01.vo.LoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;



@Slf4j
@Service
public class UserDetailCustomServiceImple implements UserDetailsService  {

    private  LoginDao loginDao;

    public UserDetailCustomServiceImple(LoginDao loginDao) {
        this.loginDao = loginDao;
    }


    // 프론트에서 로그인을 통해 clientid가 넘어옴 --> 컨트롤러에서 어떻게 해야 사용해지는가?
    //userDetailsImple을 사용해야 할 것같은데
    @Override
    public  UserDetails loadUserByUsername(String clientId) throws UsernameNotFoundException {

        log.info("loadUserByUsername-----------444:{}",clientId);

        //3. 해당아이디에 대한 정보 조회
        LoginVO loginUser = loginDao.selectClientId(clientId);
        log.info("loginUser------------555:{}",loginUser);
        //4.null 값 확인
        if (loginUser == null) {
            log.info("정보없음-----------6666:{}",loginUser);
            throw new UsernameNotFoundException("User not found with clientId: " + clientId);
        }
    
        
        //디비에서 조회해온 user 데이터로 userDetails객체 생성
        LoginVO userData = new LoginVO();
        userData.setClientId(loginUser.getClientId());
        userData.setPassword(loginUser.getPassword());
        userData.setIdentiNum(loginUser.getIdentiNum());
        userData.setRoleId(loginUser.getRoleId());

        log.info("userData-----------777:{}",userData);

        return new UserDetailsImple(userData);

    }
//end

}
