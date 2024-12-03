import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { exec } from 'child_process';
import path from 'path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    {
      name: 'copy-to-springboot',
      closeBundle() {
        // 현재경로에서 team01까지만 경로 가져오기
        const projectRootPath = path.dirname(__dirname);
        const sourceDir = path.join(projectRootPath, 'frontend/dist');
        const targetDir = path.join(projectRootPath, 'src/main/resources/static');

        // xcopy 명령어 실행
        exec(`robocopy "${sourceDir}" "${targetDir}" /E /Y /V /R:0`, { encoding: 'utf8' }, (err, stdout, stderr) => {
          if (err) {
            console.log('sourceDir:', sourceDir);
            console.log('targetDir:', targetDir);
            console.error('Error during copy:', err);
            return;
          }
          if (stderr) {
            console.error('stderr:', stderr);
          }
          console.log('stdout:', stdout);  // 복사된 파일 목록을 출력
        });
      },
    }],
  server: {
    proxy: {
      '/': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

//참고페이지 https://velog.io/@sg0xad/vite-react-%EC%99%80-%EC%8A%A4%ED%94%84%EB%A7%81-%EB%B6%80%ED%8A%B8-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0
//해당 코드는 예를 들어
// http://localhost:8080/string 으로 요청을 보내야 한다고 가정 했을 때,
// axios.get("/api/string") 으로만 요청을 보내면, 이 요청을 프록시 서버로 전송하게 된다.
// 프록시 서버는 이 전달받은 주소에서 '/api'를 제거하고,
// 대상 서버인 http://localhost:8080/string 으로 보내게 된다.