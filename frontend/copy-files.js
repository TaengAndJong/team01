import fs from 'fs-extra';  // fs-extra를 import 방식으로 가져오기
import path from 'path';

// ES 모듈에서는 import.meta.url로 __dirname을 대체 ( 절대경로를 사용함)
const __dirname = path.dirname(new URL(import.meta.url).pathname);
//__dirname /C:/Users/k/Desktop/team01/frontend

// 현재경로에서 team01까지만 경로 가져오기
const projectRootPath = path.dirname(__dirname)
// path.resolve() 는 주어진 경로를 절대경로로 변환해서 , C:/C:/ 로 출력되기때문에 join  사용하기
// React 빌드 결과물 (dist) 경로 
const source = path.join(projectRootPath, 'frontend/dist');
// Spring Boot static 폴더 경로
const destination = path.join(projectRootPath, 'src/main/resources/static');

//
function com (){
    console.log("__dirname",__dirname);
    //__dirname /C:/Users/k/Desktop/team01/frontend
    console.log("projectRootPath",projectRootPath);
    //projectRootPath /C:/Users/k/Desktop/team01
    console.log('Source Path:', source);
    //Source Path: \C:\Users\k\Desktop\team01\dist
    console.log('Destination Path:', destination);
    //Destination Path: \C:\Users\k\Desktop\team01\src\main\resources\static

}

//com();

//파일복사
fs.copy(source, destination, (err) => {
    if (err) {
        console.log('Source Path:', source);
        console.log('Destination Path:', destination);
        console.error('Copy failed:', err);
    } else {
        console.log('Files copied to Spring Boot static folder.');
    }
});
