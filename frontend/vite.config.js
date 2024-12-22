import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'



// https://vite.dev/config/
export default defineConfig({
 // base: "/api", // 기본 경로,
  plugins: [react()],
  build: {// 빌드 결과물이 생성되는 경로
    outDir: '../src/main/resources/static'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',// 백엔드 URL
        changeOrigin: true,
       // secure: false,                   // https 연결을 사용하는 경우 설정
        rewrite: (path) => path.replace(/^\/api/, ''),
        onError(err) {
          console.error('Proxy error:', err);
        },
      }
    }
  }
})

//참고페이지 https://velog.io/@sg0xad/vite-react-%EC%99%80-%EC%8A%A4%ED%94%84%EB%A7%81-%EB%B6%80%ED%8A%B8-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0
//해당 코드는 예를 들어
// http://localhost:8080/string 으로 요청을 보내야 한다고 가정 했을 때,
// axios.get("/api/string") 으로만 요청을 보내면, 이 요청을 프록시 서버로 전송하게 된다.
// 프록시 서버는 이 전달받은 주소에서 '/api'를 제거하고,
// 대상 서버인 http://localhost:8081/string 으로 보내게 된다.
