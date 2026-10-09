# true sns

> 데이터는 사용자에게 있고, 서버는 서비스를 제공할 뿐이다.

하나의 범용 게시물(Nostr 이벤트)을 호스트 설정에 따라 **트위터형 / 블로그 / 게시판**으로 보여 주고,
내 글은 **로컬이 원본**이며 언제든 **Markdown으로 내보내고 가져올 수 있는** SNS.

- 설계, 진행 상황, 발견한 문제: [DESIGN.md](DESIGN.md)
- `coracle/` — [Coracle](https://github.com/coracle-social/coracle) (MIT, © Jon Staab) 포크. 기준 커밋 `e4f46ebc0e29` (`feat: support NIP 70 protected events (#674)`). 변경은 가능한 한 `coracle/src/true/` 에 모았다.
- `dev-relay/` — 로컬 테스트 전용 최소 Nostr 릴레이 (운영에는 strfry 사용 예정)

## 실행 (Windows)
- **`start.bat`** 더블클릭: 웹 앱(5173)과 테스트 릴레이(7777)를 각각 최소화된 창으로 띄우고 브라우저를 엽니다.
- **`stop.bat`** 더블클릭: 두 서버를 모두 끕니다.
- 처음 한 번은 `cd coracle` 후 `pnpm install --ignore-scripts` (그리고 `cd ../dev-relay` 후 `npm install`) 가 필요합니다.
- 로그인 화면의 "테스트 계정으로 입장 (개발용)" 으로 가입 없이 들어갈 수 있습니다.
로컬 릴레이로만 테스트하려면 `DESIGN.md` 7절 참고.

## 라이선스
`coracle/LICENSE` (MIT) 를 유지한다. 새로 추가한 코드도 MIT.
