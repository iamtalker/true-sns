// Korean dictionary: exact English UI text -> Korean. Keys are matched after collapsing runs of
// whitespace to one space. Add entries as screens are checked; missing ones just show English.
// Terms: relay=릴레이, feed=피드, note=글, mute=숨기기, key pair=키 쌍.
export const KO: Record<string, string> = {
  // Space modes (ours)
  Micro: "짧은 글",
  Blog: "블로그",
  Board: "게시판",

  // Navigation / menu
  Feeds: "피드",
  Relays: "릴레이",
  Notifications: "알림",
  Messages: "메시지",
  Groups: "그룹",
  Lists: "목록",
  Settings: "설정",
  About: "소개",
  Terms: "이용약관",
  Privacy: "개인정보",
  Search: "검색",
  "Post +": "글쓰기 +",
  "Log In": "로그인",
  "Log Out": "로그아웃",
  "Add Account": "계정 추가",
  "Switch Account": "계정 전환",
  "App Settings": "앱 설정",
  Content: "콘텐츠",
  "Content Settings": "콘텐츠 설정",
  Database: "데이터베이스",
  Keys: "키",
  Profile: "프로필",
  Wallet: "지갑",
  Theme: "테마",
  "Toggle Theme": "테마 전환",
  Install: "설치",
  "Create Invite": "초대 만들기",

  // Feed screen
  Replies: "답글",
  Customize: "맞춤 설정",
  "Your Feeds": "내 피드",
  "From People you Follow": "내가 팔로우한 사람",
  "Notes & Replies": "글과 답글",
  Polls: "투표",
  Articles: "긴 글",
  Media: "미디어",
  Reposts: "리포스트",
  Reactions: "반응",
  Everything: "전체",
  "Relay Feeds": "릴레이 피드",
  "Edit relay feeds": "릴레이 피드 편집",
  "Your Lists": "내 목록",
  "Edit lists": "목록 편집",
  "Custom Feeds": "사용자 지정 피드",
  "Edit feeds": "피드 편집",
  "WoT Score:": "신뢰 점수:",
  relay: "릴레이",
  Quote: "인용",
  Tag: "태그",
  Mute: "숨기기",
  Report: "신고",
  Broadcast: "다시 전송",
  Delete: "삭제",
  Pin: "고정",
  Details: "상세",
  "That's all!": "여기까지입니다!",

  // Messages
  "Your conversations": "내 대화",
  Create: "만들기",
  Conversations: "대화",
  Requests: "요청",
  "Mark all as read": "모두 읽음으로 표시",
  "No messages found.": "메시지가 없습니다.",
  "Do you want to enable notes and direct messages?": "글과 쪽지를 켜시겠습니까?",
  "By default, notes and direct messages are disabled, since loading them requires Coracle to download and decrypt a lot of data.":
    "기본적으로 글과 쪽지는 꺼져 있습니다. 불러오려면 많은 데이터를 내려받아 복호화해야 하기 때문입니다.",
  "If you'd like to enable them, please make sure your signer is set up to to auto-approve requests to decrypt data.":
    "켜려면 서명 앱이 복호화 요청을 자동으로 승인하도록 설정되어 있어야 합니다.",
  "Go back": "돌아가기",
  "Enable Messages": "메시지 켜기",
  "Direct Messages": "쪽지",

  // Groups
  "Groups are going away!": "그룹 기능은 곧 사라집니다!",
  "You can still access your groups at": "그룹은 다음 주소에서 계속 이용할 수 있습니다:",
  ", or you can try our new relay-based groups client at": ". 또는 새로운 릴레이 기반 그룹 앱을 써 보세요:",
  "Continue to Groups": "그룹으로 계속",
  "Try Flotilla": "Flotilla 써 보기",

  // Lists / feeds
  "Your lists": "내 목록",
  List: "목록",
  "You don't have any lists yet.": "아직 목록이 없습니다.",
  "Create a list": "목록 만들기",
  "Other lists": "다른 목록",
  "Lists created by people in your network.": "내 네트워크의 사람들이 만든 목록입니다.",
  "Search lists": "목록 검색",
  "Your feeds": "내 피드",
  Feed: "피드",
  "You don't have any feeds yet.": "아직 피드가 없습니다.",
  "Create a feed": "피드 만들기",
  "Other feeds": "다른 피드",
  "Feeds created by people in your network.": "내 네트워크의 사람들이 만든 피드입니다.",
  "Search feeds": "피드 검색",

  // Notifications
  "Mentions & Replies": "멘션과 답글",
  "No notifications found - check back later!": "알림이 없습니다. 나중에 다시 확인해 보세요!",

  // Content settings
  "Control who and what you see on Coracle.": "보고 싶은 사람과 내용을 정합니다.",
  "Note actions": "글 아래 버튼",
  zaps: "잽",
  replies: "답글",
  reactions: "반응",
  reposts: "리포스트",
  recommended_apps: "추천 앱",
  "Controls which icons appear at the bottom of any given note. Disabling these can reduce how much data Coracle uses.":
    "글 아래에 표시할 아이콘을 정합니다. 끄면 데이터 사용량이 줄어듭니다.",
  "Show media": "미디어 표시",
  "If enabled, Coracle will automatically show images, video, and audio embedded in notes.":
    "켜면 글에 포함된 이미지, 영상, 오디오를 자동으로 보여 줍니다.",
  "Show link previews": "링크 미리보기 표시",
  "If enabled, Coracle will show a preview card for links to other websites. If disabled, they appear as plain hyperlinks. This only applies when media is shown.":
    "켜면 다른 웹사이트 링크에 미리보기 카드를 보여 주고, 끄면 일반 링크로 표시합니다. 미디어를 표시할 때만 적용됩니다.",
  "Hide sensitive content": "민감한 콘텐츠 숨기기",
  "If enabled, content flagged by the author as potentially sensitive will be hidden.":
    "켜면 작성자가 민감할 수 있다고 표시한 콘텐츠를 숨깁니다.",
  "Minimum WoT score": "최소 신뢰 점수",
  "Select a minimum": "최소",
  "web-of-trust": "신뢰망(WoT)",
  "score. Notes from accounts with a lower score will be automatically hidden.":
    "점수를 정합니다. 점수가 낮은 계정의 글은 자동으로 숨겨집니다.",
  "Minimum Proof of Work": "최소 작업 증명",
  difficulty: "난이도",
  ms: "ms",
  "Select a minimum proof-of-work difficulty for notes from people outside your network. If a note fails to meet both your minimum web of trust score and minimum proof-of-work difficulty, it will be hidden.":
    "내 네트워크 밖 사람의 글에 요구할 최소 작업 증명 난이도를 정합니다. 최소 신뢰 점수와 최소 작업 증명 난이도를 둘 다 충족하지 못하면 글이 숨겨집니다.",
  Mutes: "숨김 목록",
  "Publicly muted accounts": "공개로 숨긴 계정",
  "Notes from these people will be hidden by default. This information may be used to identify impersonators and spammers.":
    "이 사람들의 글은 기본적으로 숨겨집니다. 이 정보는 사칭 계정이나 스팸 계정을 가려내는 데 쓰일 수 있습니다.",
  "Privately muted accounts": "비공개로 숨긴 계정",
  "Notes from these people will be hidden by default. This information will be encrypted.":
    "이 사람들의 글은 기본적으로 숨겨집니다. 이 정보는 암호화됩니다.",
  "Publicly muted words": "공개로 숨긴 단어",
  "Notes containing these words will be hidden by default. This information may be used to identify impersonators and spammers.":
    "이 단어가 들어간 글은 기본적으로 숨겨집니다. 이 정보는 사칭 계정이나 스팸 계정을 가려내는 데 쓰일 수 있습니다.",
  "Privately muted words": "비공개로 숨긴 단어",
  "Notes containing these words will be hidden by default. This information will be encrypted.":
    "이 단어가 들어간 글은 기본적으로 숨겨집니다. 이 정보는 암호화됩니다.",
  "Publicly muted topics": "공개로 숨긴 주제",
  "Notes tagging these topics will be hidden by default. This information may be used to identify impersonators and spammers.":
    "이 주제가 달린 글은 기본적으로 숨겨집니다. 이 정보는 사칭 계정이나 스팸 계정을 가려내는 데 쓰일 수 있습니다.",
  "Privately muted topics": "비공개로 숨긴 주제",
  "Notes tagging these topics will be hidden by default. This information will be encrypted.":
    "이 주제가 달린 글은 기본적으로 숨겨집니다. 이 정보는 암호화됩니다.",
  Save: "저장",

  // Database (backup / import / export)
  "App Database": "앱 데이터베이스",
  "View, import, and export your local database.": "이 기기의 데이터베이스를 보고, 가져오고, 내보냅니다.",
  "Export Database": "데이터베이스 내보내기",
  "Create Backup": "백업 만들기",
  "Import Database": "데이터베이스 가져오기",
  "Upload a nostr export file to pull events into your database.":
    "nostr 내보내기 파일을 올려서 데이터베이스로 가져옵니다.",
  "Upload Backup": "백업 올리기",
  Created: "작성 시각",
  Author: "작성자",
  Kind: "종류",
  "Export Settings": "내보내기 설정",
  "Select which events you'd like to export": "내보낼 항목을 선택하세요",
  "Only export your events": "내 글만 내보내기",
  "If enabled, only your events will be exported.": "켜면 내가 쓴 것만 내보냅니다.",
  "Export (JSONL, signed events)": "내보내기 (JSONL, 서명된 원본)",
  "Export notes as Markdown": "글을 Markdown으로 내보내기",
  "Keep a folder of .md files up to date": "폴더에 .md 파일을 항상 최신으로 유지",
  "Your notes and articles are saved as plain Markdown files in a folder you choose. Files are only added or updated, never deleted.":
    "내 글은 선택한 폴더에 일반 Markdown 파일로 저장됩니다. 파일은 추가하거나 갱신만 하고 절대 삭제하지 않습니다.",
  "This browser can't write to a folder. Use the Markdown export above.":
    "이 브라우저는 폴더에 쓸 수 없습니다. 위의 Markdown 내보내기를 이용하세요.",
  "Choose folder": "폴더 선택",
  "Change folder": "폴더 변경",
  "Sync now": "지금 동기화",
  "Allow and sync": "허용하고 동기화",
  Stop: "중지",
  "Import Data": "데이터 가져오기",
  "Populate Coracle's database with a nostr export file or Markdown notes":
    "nostr 내보내기 파일이나 Markdown 글로 데이터베이스를 채웁니다",
  "Nostr exports are .jsonl files. Some software may compress exports, be sure to upload an uncompressed version. Markdown (.md) files are signed with your key and saved locally.":
    "Nostr 내보내기 파일은 .jsonl입니다. 압축된 파일이면 압축을 푼 뒤 올려 주세요. Markdown(.md) 파일은 내 키로 서명되어 이 기기에 저장됩니다.",
  Import: "가져오기",
  "No notes or articles to export.": "내보낼 글이 없습니다.",
  "Processing your import...": "가져오는 중...",
  "Import complete!": "가져오기 완료!",
  "Please select a file to import.": "가져올 파일을 선택하세요.",
  "Something went wrong!": "문제가 발생했습니다!",
  "Log in to import Markdown (notes are signed with your key).":
    "Markdown을 가져오려면 로그인하세요 (글은 내 키로 서명됩니다).",

  // Keys
  "Your keys": "내 키",
  "Your account is identified across the network using a public/private": "내 계정은 네트워크에서 공개/비공개",
  keypair: "키 쌍",
  ". This allows you to fully own your account, and move to another app if needed.":
    "으로 식별됩니다. 계정을 온전히 소유하며, 필요하면 다른 앱으로 옮길 수 있습니다.",
  "Public Key": "공개 키",
  Show: "보기",
  raw: "원본",
  version: "형식",
  "Your public key identifies your account. You can share this with people trying to find you on nostr.":
    "공개 키는 내 계정을 식별합니다. nostr에서 나를 찾으려는 사람에게 알려 줘도 됩니다.",
  "Private Key": "비공개 키",
  "Your private key is used to prove your identity by cryptographically signing messages.":
    "비공개 키는 메시지에 서명해서 내가 나임을 증명하는 데 쓰입니다.",
  "Do not share this with anyone.": "절대 다른 사람에게 알려 주지 마세요.",
  "Be careful about copying this into other apps - instead, consider using a":
    "다른 앱에 복사할 때는 조심하세요. 대신 다음을 사용해 보세요:",
  "compatible browser extension": "호환되는 브라우저 확장 프로그램",
  "to securely store your key.": "(키를 안전하게 보관할 수 있습니다)",

  // Profile
  "About You": "내 소개",
  "Give people a friendly way to recognize you. We recommend you do not use your real name or share your personal information. The future of the internet is":
    "사람들이 나를 알아볼 수 있게 해 주세요. 실명이나 개인 정보는 쓰지 않는 것을 권장합니다. 인터넷의 미래는",
  pseudonymous: "가명 기반",
  Username: "사용자 이름",
  "In most clients, this image will be shown on your profile page.": "대부분의 앱에서 이 이미지가 프로필 페이지에 표시됩니다.",
  "NIP-05 Identifier": "NIP-05 식별자",
  "Enter a": "다음 형식의",
  "NIP-05": "NIP-05",
  "address to verify your public key.": "주소를 입력해 공개 키를 인증하세요.",
  "Lightning address": "라이트닝 주소",
  "lightning address": "라이트닝 주소",
  "to enable sending and receiving bitcoin tips.": "를 입력하면 비트코인 후원을 주고받을 수 있습니다.",
  Website: "웹사이트",
  "Enter any url where people can find out more about you.": "나를 더 알 수 있는 주소를 입력하세요.",
  "About you": "자기소개",
  "Tell the world about yourself. This will be shown on your profile page.":
    "자신을 소개해 주세요. 프로필 페이지에 표시됩니다.",
  "Profile Picture": "프로필 사진",
  "Please be mindful of others and only use small images.": "다른 사람을 배려해 작은 이미지만 사용해 주세요.",

  // Relays
  "Your relays": "내 릴레이",
  "Add Relay": "릴레이 추가",
  "Relays are hubs for your content and connections. At least one is required to interact with the network, but you can join as many as you like.":
    "릴레이는 내 글과 연결을 주고받는 중계 서버입니다. 네트워크를 쓰려면 최소 하나가 필요하고, 원하는 만큼 추가할 수 있습니다.",
  "No relays connected": "연결된 릴레이가 없습니다",
  "Other relays": "다른 릴레이",
  "Below are relays used by people in your network. Adding these may improve your ability to load profiles and content.":
    "아래는 내 네트워크의 사람들이 쓰는 릴레이입니다. 추가하면 프로필과 글을 더 잘 불러올 수 있습니다.",
  NIPs: "NIP",
  Connected: "연결됨",
  "1 time": "1회",
  Info: "정보",
  Explore: "둘러보기",
  Join: "추가",
  Read: "읽기",
  Write: "쓰기",
  Messaging: "메시지",
  "Search relays or add a custom url": "릴레이를 검색하거나 주소를 직접 입력하세요",

  // Composer
  "Create a Note": "글쓰기",
  Title: "제목",
  "What do you want to say?": "무슨 이야기를 하고 싶으세요?",
  characters: "자",
  words: "단어",
  "Add poll options": "투표 항목 추가",
  "Remove poll options": "투표 항목 제거",
  "Show Preview": "미리보기 보기",
  "Hide Preview": "미리보기 닫기",
  Preview: "미리보기",
  Send: "보내기",
  Schedule: "예약",
  "Signing your note...": "서명하는 중...",
  "Generating Work...": "작업 증명 생성 중...",
  "Uploading media...": "미디어 업로드 중...",
  "Please provide a title.": "제목을 입력하세요.",
  "Please provide some content.": "내용을 입력하세요.",
  "Please provide a description.": "내용을 입력하세요.",

  // About
  Coracle: "Coracle",
  "A Nostr client for feeds that puts relays first.": "릴레이를 중심에 둔 Nostr 앱입니다.",
  "Support development": "개발 후원",
  "All funds will be used to support server costs and development.": "모든 후원금은 서버 비용과 개발에 쓰입니다.",
  "Zap the developer": "개발자에게 후원하기",
  "Get in touch": "문의하기",
  "Having problems? Let us know.": "문제가 있나요? 알려 주세요.",
  "Open an Issue": "이슈 남기기",
  "Source Code": "소스 코드",
  "Dev Blog": "개발 블로그",
  Podcast: "팟캐스트",

  // Login / signup
  "Welcome!": "환영합니다!",
  "Use a test account (dev only)": "테스트 계정으로 입장 (개발용)",
  "Use Remote Signer": "원격 서명 앱 사용",
  "Use Browser Extension": "브라우저 확장 프로그램 사용",
  "Browse Signer Apps": "서명 앱 둘러보기",
  "Need an account?": "계정이 필요하신가요?",
  "Register instead": "가입하기",
  "We're searching for your profile on the network.": "네트워크에서 내 프로필을 찾는 중입니다.",
  "You can also skip this step, but be aware that your profile and relays may not get properly synchronized.":
    "이 단계를 건너뛸 수도 있지만, 프로필과 릴레이가 제대로 동기화되지 않을 수 있습니다.",
  "New to Nostr?": "Nostr가 처음이신가요?",
  "Learn about the protocol at your own pace by watching one of our tutorial videos.":
    "튜토리얼 영상으로 천천히 프로토콜을 알아보세요.",
  "Nostr in 30 seconds": "30초로 보는 Nostr",
  "Coracle deep dive": "Coracle 자세히 보기",
  "When you’re ready, click below and we’ll guide you through the process of creating an account.":
    "준비되셨으면 아래를 눌러 계정 만들기를 시작하세요.",
  "Let's go!": "시작하기!",
  "Create your Profile": "프로필 만들기",
  Back: "뒤로",
  Continue: "계속",
}

// For text with numbers or names in it
export const KO_PATTERNS: [RegExp, string][] = [
  [/^(\d[\d,]*) characters$/, "$1자"],
  [/^(\d[\d,]*) \/ (\d+) characters$/, "$1 / $2자"],
  [/^(\d[\d,]*) words$/, "$1단어"],
  [
    /^Click below to download a backup of all ([\d,]+) events in your database\.$/,
    "아래를 눌러 데이터베이스의 모든 항목($1개)을 백업으로 내려받으세요.",
  ],
  [/^Imported (\d+) Markdown file\(s\)\.$/, "Markdown 파일 $1개를 가져왔습니다."],
  [/^Saved (\d+) markdown files\.$/, "Markdown 파일 $1개를 저장했습니다."],
  [/^Wrote (\d+) file\(s\) to (.*)$/, "$2에 파일 $1개를 저장했습니다."],
  [
    /^Saved (\d+) files to Documents\/true-sns-export$/,
    "Documents/true-sns-export에 파일 $1개를 저장했습니다.",
  ],
  [/^This space allows at most (\d+) characters\.$/, "이 공간은 최대 $1자까지 쓸 수 있습니다."],
  [/^Failed to parse row #(\d+)$/, "$1번째 줄을 읽지 못했습니다"],
  [/^Folder: (.*)$/, "폴더: $1"],
  [/^(\d+) relays?$/, "릴레이 $1개"],
  [/^Connected (\d+) times?$/, "$1회 연결됨"],
  [/^(\d+) NIPs?$/, "NIP $1개"],
]
