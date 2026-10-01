# board-ts

Spring Boot Board API (https://github.com/MyeongSooJang/Board) 를 Express + TypeORM + PostgreSQL 로 이식하는 학습 프로젝트.
설계는 `docs/superpowers/specs/2026-10-01-board-ts-migration-design.md` 를 따른다.

## 작업 방식
- 사용자가 TypeScript 를 배우며 **직접 코드를 작성**한다. 요청 없이 구현 코드를 대신 쓰지 않는다.
- Claude 는 설명, 질문 답변, 코드 리뷰를 맡는다. Java ↔ TS 대응 개념을 곁들여 설명한다.

## 코드 스타일
- 포맷은 Prettier 가 정한다 (`.prettierrc`). 큰따옴표, 세미콜론, 2칸 들여쓰기, 줄 길이 100.
- 품질 검사는 ESLint 가 한다 (`eslint.config.mjs`).
- 포맷 변경과 로직 변경은 한 커밋에 섞지 않는다. (`.claude/skills/commit` 참고)

## 네이밍
| 대상 | 규칙 | 예 |
|---|---|---|
| 클래스 파일 | PascalCase | `Member.ts`, `BoardService.ts` |
| 그 외 파일 | kebab-case | `data-source.ts`, `env.ts` |
| 클래스, 인터페이스, enum, 타입 | PascalCase | `BoardService`, `SortType` |
| 변수, 함수, 메서드 | camelCase | `increaseViewCount` |
| 상수, enum 값 | UPPER_SNAKE_CASE | `ErrorCode.NOT_FOUND` |
- 인터페이스에 `I` 접두사를 붙이지 않는다.

## 코드 관례
- `any` 를 쓰지 않는다. 타입을 모르면 `unknown` 으로 받고 좁힌다.
- 타입 단언(`as`, `!`)은 마지막 수단이다. 먼저 타입 좁히기(narrowing)로 해결한다.
- 비교는 `===` 만 쓴다. `var` 는 쓰지 않고, 기본은 `const` 다.
- `import` 경로에 확장자를 쓰지 않는다.
- 주석은 이름으로 설명되지 않는 이유(WHY)가 있을 때만 쓴다.

## 도메인 원칙
- 규칙은 엔티티와 값 객체가 스스로 처리한다. Service 는 조회, 엔티티 메서드 호출, 저장만 한다.
- 엔티티 필드를 외부에서 직접 바꾸지 않고 의미 있는 메서드(`update`, `softDelete` 등)로만 바꾼다.
- 환경변수는 `src/config/env.ts` 를 통해서만 읽는다. 다른 파일에서 `process.env` 를 직접 쓰지 않는다.

## 명령어
- `npm run dev`: 개발 서버 (nodemon + ts-node)
- `npx tsc --noEmit`: 타입 검사
- `npm run lint`, `npm run format`: 설치 후 추가되는 스크립트
