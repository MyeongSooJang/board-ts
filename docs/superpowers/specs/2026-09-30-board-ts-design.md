# board-ts 설계 문서

## 목표

- Spring Boot Board API(Java) → TypeScript/Express 마이그레이션
- TypeScript 문법 습득 + OOP 구조 강화 (Rich Domain Model)
- 1차 범위: `member` + `auth` + `board` 3도메인

## 스택

- Express ^5, TypeORM ^1, MySQL2, dotenv
- TypeScript ^7, ts-node, nodemon

## 아키텍처

클래스 기반 레이어드 아키텍처 + Repository 인터페이스 DI

```
Controller → Service → IRepository → TypeORM DataSource
```

각 도메인은 `entity / dto / repository / service / controller` 구조를 가진다.
조립(DI)은 `src/index.ts` 한 곳에서 수동으로 수행한다.

## 도메인 설계 원칙

**Rich Domain Model** — 판단과 상태 변경은 엔티티가 직접 담당한다.

```typescript
// Service는 흐름만 조율
const board = await this.boardRepository.findById(boardId);
board.validateOwner(username);   // 엔티티가 판단
board.update(title, content);    // 엔티티가 상태 변경
await this.boardRepository.save(board);
```

엔티티 필수 메서드:
- `Member`: `validateActive()`, `softDelete()`, `update()`
- `Board`: `validateOwner(username)`, `update()`, `softDelete()`, `increaseViewCount()`

## 인터페이스 DI

```typescript
// Repository만 인터페이스에 의존 (구현체 교체 가능)
class BoardService {
  constructor(private readonly boardRepository: IBoardRepository) {}
}

// index.ts에서 조립
const boardRepository = new BoardRepository(dataSource);
const boardService = new BoardService(boardRepository);
const boardController = new BoardController(boardService);
```

## 예외 처리

```typescript
type ErrorCode = 'MEMBER_NOT_FOUND' | 'BOARD_NOT_FOUND' | 'NOT_AUTHOR' | 'DUPLICATE_USERNAME' | 'INVALID_TOKEN';

const ERROR_META: Record<ErrorCode, { status: number; message: string }> = { ... };

class AppException extends Error {
  constructor(public readonly code: ErrorCode) { ... }
}

// Express error middleware에서 일괄 처리
```

## TypeScript 핵심 패턴

- **Generic Repository**: `IRepository<T, ID>`
- **const object enum**: `SortType`, `SearchType` (Java enum의 fromSort() 대체)
- **Utility Types**: DTO 설계에 `Pick`, `Omit` 활용
- **union type**: `ErrorCode` 타입으로 컴파일 타임 에러 보장

## 폴더 구조

```
src/
├── common/
│   ├── BaseEntity.ts
│   └── IRepository.ts           # Generic Repository 인터페이스
├── config/
│   ├── DataSource.ts
│   └── middleware/errorHandler.ts
├── exception/
│   ├── AppException.ts
│   └── ErrorCode.ts
├── member/
│   ├── entity/Member.ts
│   ├── dto/
│   ├── repository/IMemberRepository.ts + MemberRepository.ts
│   ├── service/MemberService.ts
│   └── controller/MemberController.ts
├── auth/
│   └── (entity, dto, repository/IAuthRepository+AuthRepository, service, controller)
├── board/
│   └── (entity, dto, repository/IBoardRepository+BoardRepository, service, controller)
└── index.ts                     # DI 조립 + 서버 기동
```

## 구현 순서

1. 공통 기반 (BaseEntity, IRepository, AppException, ErrorCode, DataSource, errorHandler)
2. Member 도메인
3. Auth 도메인 (JWT)
4. Board 도메인
