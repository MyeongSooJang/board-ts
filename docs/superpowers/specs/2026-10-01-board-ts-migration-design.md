# Board API TypeScript 마이그레이션 설계

## 목표
- 원본: https://github.com/MyeongSooJang/Board (Spring Boot 3 / Java 21 / JPA / MySQL / JWT / S3)
- 대상: 백엔드만 Express + TypeORM + MySQL 로 이식 (Vue 프론트는 그대로, 엔드포인트·응답 형식 호환)
- 핵심 방향: **풍부한 도메인 모델**. 객체가 규칙을 스스로 처리하고, Service 는 조회 → 엔티티 메서드 호출 → 저장만 하는 얇은 계층.
- TypeScript 학습이 병행되므로, Java ↔ TS 대응 개념을 각 단계에서 설명한다.

## 범위
- 포함: auth, board, boardlike, bookmark, comment, commentlike, image(S3 presigned), member, report, security(JWT), exception, 공통 BaseEntity
- 제외: 프론트엔드 TS 변환, Swagger(후순위), 배포 설정
- DB: 원본 `init_schema.sql` 과 동일한 MySQL 스키마 사용 (가정. 변경 시 이 문서를 수정)

## 접근법
TypeORM 엔티티 = 도메인 객체 (JPA 원본과 동일한 방식). 별도 순수 도메인/매퍼 계층은 두지 않는다.

## 구조
```
src/
├─ index.ts / app.ts
├─ config/        env, DataSource, S3
├─ common/        BaseEntity, Count(값 객체)
├─ exception/     CustomException 계층, ErrorCode, 전역 에러 핸들러
├─ security/      JwtTokenProvider, 인증 미들웨어
└─ <domain>/      Entity, Repository, Service, Controller, dto/
```

## 계층 책임
| 계층 | 한다 | 하지 않는다 |
|---|---|---|
| Controller | 요청 파싱, DTO 변환, 응답 | 비즈니스 규칙 |
| Service | 조회, 엔티티 메서드 호출, 저장, 트랜잭션 경계 | 권한 검사 `if`, 카운트 계산 |
| Entity | 권한 검사(`assertWrittenBy`), 상태 변경, 불변식 | DB 조회, HTTP |
| Repository | 쿼리 | 규칙 |

## 도메인 모델 원칙
- 카운트(조회수·댓글수·좋아요수)는 값 객체 `Count` 가 0 미만을 스스로 막는다.
- 상태/정렬 enum(`SortType`, `SearchType`, `ReportTarget`)은 변환·분기 행위를 가진다 (Java `switch` 대체).
- 엔티티는 `static create(...)` 팩토리와 의미 있는 메서드(`update`, `softDelete`, `increaseViewCount` 등)만 외부에 노출하고, 필드 직접 변경은 지양한다.
- 도메인 간 협력은 서비스에서 repository 를 여러 개 끌어오는 대신 엔티티 메서드 인자로 객체를 전달한다 (예: `board.update(title, content, member)`).
- HTML sanitize(XSS)는 원본의 jsoup 대신 sanitize 라이브러리를 쓰되, 호출 위치는 도메인(엔티티 생성/수정)으로 이동할지 구현 시 결정한다.

## 에러 처리
- `CustomException` 을 상속한 `NotFoundException`, `DuplicateException`, `UnauthorizedException`, `ValidationException`, `TokenException`.
- `ErrorCode` enum 과 `ErrorResponse` 형식은 원본과 동일하게 유지 (프론트 호환).
- Express 전역 에러 미들웨어가 예외 → HTTP 응답으로 변환한다.

## 테스트
- 도메인 규칙은 DB 없이 엔티티 단위 테스트(Jest)로 검증.
- 서비스/컨트롤러는 통합 테스트로 최소 경로만 확인.

## 진행 순서 (제안)
1. 기반: BaseEntity, 예외 계층, 전역 핸들러, DataSource
2. member + security(JWT) + auth
3. board (+ 검색/정렬)
4. comment, boardlike, commentlike, bookmark
5. report, image(S3)

## 열린 항목
- 작업 방식(누가 코드를 쓰는지: 직접 작성 + 리뷰 / 함께 / 대행)은 구현 계획 단계에서 정한다.
