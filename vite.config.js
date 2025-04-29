import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // 여기에 원하는 포트 지정
    host: "0.0.0.0", // (선택) 외부 네트워크 접속 허용
  },
  test: {
    environment: "jsdom", // 브라우저 환경 흉내
    globals: true, // describe/test 등을 global로 사용 가능
    setupFiles: "./src/setupTests.js", // 초기 설정 파일
  },
});
