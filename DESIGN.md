# true sns — 설계 문서 (초안)

> 데이터는 사용자에게 있고, 서버는 서비스를 제공할 뿐이다.

## 1. 핵심 아이디어
- 하나의 범용 게시물 데이터를, 호스트 설정에 따라 게시판 / 트위터형 / 블로그 / 포럼 / 위키로 표현한다.
- 원본은 사용자 로컬에 둔다. 서버(릴레이)는 동기화·검색·연결 수단이다.
- 언제든 Markdown으로 export / import 가능해야 한다.
- 신원은 공개키, 게시물은 전자서명. 서버가 바뀌어도 정체성은 유지된다.

## 2. 3계층 구조
```
┌ 표현 층 : 호스트 설정으로 게시판/트위터/블로그 뷰 전환     ← 직접 구현
├ 소유 층 : 로컬 원본 + Markdown export/import              ← 직접 구현
└ 전송 층 : 서명된 이벤트 + 릴레이 + 공개키 신원             ← Nostr 활용
```

## 3. 기존 오픈소스 활용 계획
| 역할 | 선택 | 라이선스 | 비고 |
|---|---|---|---|
| 클라이언트 | Coracle 포크 (Svelte + TS + Vite + Capacitor) | MIT | `coracle/` 에 clone 완료 |
| Nostr 라이브러리 | welshman (`@welshman/*`, Coracle 내장) | MIT 계열(확인 필요) | NDK 대신 이것을 사용 |
| 릴레이 | strfry (그대로 실행, 코드 수정 금지) | GPLv3 | 수정·결합 시 GPL 의무 발생 |
| 참고 | plaintext.casa | **라이선스 명시 없음** | 코드 사용 불가, 개념만 참고 |

## 4. Coracle 코드 분석 결과
- 소스 298파일. `src/app/views`(화면), `src/engine`(상태/저장/요청), `src/domain`(모델).
- **저장**: `src/engine/storage.ts` — IndexedDB(`coracle-<pubkey>`).
  - 내 세션 글 + 프로필/팔로우/뮤트/릴레이 이벤트만 우선 저장(`rankEvent`).
  - `EVENT_LIMIT = 10,000` 초과 시 오래된 이벤트 prune → **로컬이 원본이 아님**.
- **export/import**: `DataExport.svelte` / `DataImport.svelte` — 서명된 이벤트 JSONL 만 지원. Markdown 없음.
  - import 는 `isSignedEvent` 통과분을 `repository.publish` 로 로컬 반영(릴레이 전송은 아님).
- **글 작성**: `NoteCreate.svelte` — 제목 개념 없음(kind 1 `Note`, 투표 `Poll`). 긴 글(kind 30023)은 보기만 있음(`NoteContentKind30023.svelte`).
- **피드**: `Home.svelte` → `Feeds.svelte`, 필터는 `shared/FeedForm*.svelte` 계열. Articles 필터 이미 존재.
- 기본 릴레이/설정은 `.env.template` (`VITE_DEFAULT_RELAYS=relay.damus.io,nos.lol` 등).

## 5. 구현 단계

### 1단계 — 소유 층 (가장 큰 차별점, 먼저)
1. **내 이벤트 영구 보존**: prune 대상에서 내 pubkey 이벤트 제외 (`storage.ts` `rankEvent`/`prune`).
2. **Markdown export**: 내 글을 `.md` 파일로. kind 1 → 짧은 글, kind 30023 → 제목/요약/태그를 frontmatter 로.
   ```
   ---
   id: <event id>   kind: 30023   d: <slug>
   title: ...   published_at: ...   tags: [...]
   ---
   본문 Markdown
   ```
   폴더 구조(예: `notes/`, `articles/`)로 zip 또는 File System Access API 폴더 쓰기.
3. **Markdown import**: frontmatter 가 있으면 복원, 없으면 새 kind 30023(또는 1) 이벤트로 서명 후 발행. 같은 `d` 는 교체(replaceable).
4. 기존 JSONL export/import 는 "원본 백업"으로 유지.

**1단계 진행 상황**
- [x] 내 이벤트 prune 제외 — `storage.ts` `prune`
- [x] 변환 모듈 `src/true/markdown.ts` + 단위 테스트 `tests/unit/true/markdown.spec.ts` (4건 통과)
- [x] Export 화면에 "Export notes as Markdown" 추가 (폴더 선택 / Capacitor Documents / 단일 파일 폴백)
- [x] Import 화면이 `.md` 다중 선택 지원 (내 키로 서명 → 로컬 저장만, 릴레이 전송 안 함)
- [ ] 브라우저 UI 실동작 확인 (테스트 계정 생성 후), JSONL 혼합 import 확인
- [ ] 로컬 삭제된 글/중복 import 처리(같은 `d` 교체) 검증

**저장 누락 수정 (완료)**: 내 이벤트는 3초 배치 flush 를 기다리지 않고 즉시 IndexedDB 에 기록(`storage.ts` `syncEvents`). 가져온 직후 300ms 만에 페이지 이동해도 보존됨을 브라우저에서 확인.

### 2단계 — 표현 층
**진행 상황 (구현됨, 일부만 검증)**
- [x] `src/true/spaceConfig.ts`: micro / blog / board 설정(kinds, layout, 제목 필수 여부, 글자수 제한) + `checkDraft`, `slugifyTitle` — 단위 테스트 6건
- [x] `src/true/space.ts`: 모드 저장소(localStorage `true/space`, 기기별 설정)
- [x] `Feeds.svelte`: Micro / Blog / Board 전환 버튼 — 브라우저에서 클릭 시 저장값 변경 확인
- [x] `Feed.svelte`: blog=30023, board=1+30023 로 기본 kinds 제한, board 는 `src/true/BoardRow.svelte`(제목·작성자·날짜 목록) 렌더
- [x] `NoteCreate.svelte`: blog/board 에서 제목 입력 → kind 30023(`d`=제목slug+랜덤6자, `title`, `published_at`)로 발행, micro 는 280자 제한
- [x] **로컬 우선 피드**: `Feed.svelte` `showLocalFirst` — 피드 정의를 컴파일해 로컬 저장소를 즉시 조회(원래는 네트워크 race 후에야 로컬 조회). 릴레이 접속이 타임아웃인 환경에서도 내 글이 바로 표시됨.
- [x] **브라우저 실확인** (내 프로필 페이지, 가져온 글 3개: 긴 글 2 + 짧은 글 1):
  - board: 제목·작성자·날짜 한 줄 목록 3행
  - blog: 긴 글 2개만, 제목+요약 카드
  - micro: 3개 모두 기존 카드 방식
- [x] **실발행 확인 (로컬 테스트 릴레이)**: Blog 모드에서 제목 없이 Send → "Please provide a title." 차단, 제목+본문 → kind 30023 (`d`=제목slug+랜덤6자, `title`, `published_at`) 서명되어 릴레이에 저장됨. 발행 테스트 중 발견·수정한 버그: `d` 태그를 `addTags` 로 넣으면 `ArticleWriter.validate` 가 거부 → `setIdentifier()` 사용.
- [ ] board 상세/댓글 화면은 미확인

**발견: 릴레이 관련**
- welshman 라우터는 기본적으로 `ws://` 및 localhost 릴레이를 제외함 → 개발용 플래그 `VITE_ALLOW_LOCAL_RELAYS=true` 추가(`env.ts`, `core.ts` 의 Resolver `allowLocal`/`allowInsecure`). 기본값 꺼짐.
- **릴레이 목록이 비어 있는 계정은 발행이 조용히 아무 곳에도 안 나감**(코드에 TODO 로 남아 있음). 신규 가입/첫 로그인 시 기본 릴레이를 사용자 릴레이 목록(kind 10002)에 넣어 주는 온보딩 처리가 필요. 로컬에는 저장되므로 데이터 손실은 아니지만 사용자에게 알려야 함.

**발견: 로컬 우선과 충돌하는 지점** — Coracle 은 "네트워크 먼저, 로컬 캐시는 나중". 구상(로컬이 원본)과 반대이므로 `Feed.svelte` 에서 로컬 저장소를 즉시 조회해 먼저 그리는 로직이 필요하다.
1. **Space(호스트) 설정 모델**: `{ mode: "board"|"micro"|"blog", titleRequired, maxLength, kinds[], layout }` 를 JSON 으로 정의(처음엔 앱 설정/URL 파라미터).
2. `Feeds.svelte` / `NoteCreate.svelte` 를 mode 에 따라 분기:
   - micro: 제목 숨김, 글자수 제한(kind 1)
   - blog: 제목 + 긴 본문(kind 30023), 카드/목록
   - board: 제목 목록 + 상세 + 댓글(답글 태그), 정렬은 최신/활동순
3. 데이터는 동일(Nostr 이벤트), 뷰만 교체됨을 검증.

### 3단계 — 전송/서버
- strfry 를 로컬/서버에 띄워 전용 릴레이 구성. 내 데이터는 로컬 → 릴레이로 발행(재발행 가능).
- (장기) 릴레이 간 Negentropy 동기화, P2P 는 보류.

## 6. 미해결 / 위험
- **키 분실·탈취**: 복구 수단 없음 → 백업 안내, NIP-46(원격 서명)/NIP-07 활용 검토.
- **삭제**: 서명된 글은 완전 삭제 불가(삭제 요청 이벤트뿐).
- **게시판/위키 의미론**: 제목·버전·정렬은 Nostr 표준 kind 로 완전히 표현되지 않음 → 선택 필드(tags)로 두고 뷰마다 무시/사용.
- **스팸**: 릴레이 정책(화이트리스트 등)에 의존.
- plaintext.casa 의 라이선스 확인 전까지 코드 재사용 금지.
- Coracle 업스트림 변경 추적 부담 → 변경을 `src/true/` 같은 별도 디렉터리로 최대한 격리.

## 7. 개발 환경 메모 (이 PC)
- 위치: `C:\claude program\true sns\coracle`
- 의존성: `pnpm install --ignore-scripts` (pnpm 12.10.1 전역 설치됨; 프로젝트 지정은 10.33.0)
- 실행: `pnpm dev` → http://localhost:5173
- `nostr-signer-capacitor-plugin` 은 빌드 산출물이 없어 `stubs/` + `vite.config.js` alias 로 대체함(웹 개발용). **Android 빌드 시 alias 제거 필요.**
- 콘솔 오류 2건(500, 연결 거부)은 미조사.
- **로컬 테스트 릴레이**: `C:\claude program\true sns\dev-relay` (`npm install` 후 `node relay.mjs`, 포트 7777, 메모리 저장, NIP-01/11, 서명 검증·교체형/주소형 이벤트·삭제 지원, `node selftest.mjs` 로 자체 점검). 운영용은 strfry.
- 앱을 그 릴레이로 연결하려면 `coracle/.env` (git 무시됨):
  `VITE_DEFAULT_RELAYS / INDEXER / SEARCH / DVM / SIGNER_RELAYS = ws://localhost:7777`, `VITE_ALLOW_LOCAL_RELAYS=true` → dev 서버 재시작. 이 상태에선 공개 릴레이로 아무것도 나가지 않음.
- 테스트 계정은 가입 화면(외부 nstart 로 이동) 대신, 일회용 키를 localStorage `sessions`/`pubkey` 에 직접 넣어 로그인(테스트 후 삭제).
