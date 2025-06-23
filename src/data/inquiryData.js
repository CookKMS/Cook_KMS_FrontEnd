// src/data/inquiryData.js
export const inquiryData = [  // ✅ 이름 수정
  {
    id: 1,
    manufacturer: 'A 고객사',
    subject: '제품 A 펌웨어 문제',
    status: '답변 완료',
    date: '2023. 7. 15.',
    message: '제품 A의 최신 펌웨어를 설치했는데 작동이 안됩니다.',
    response: '펌웨어를 다시 설치해 보시기 바랍니다.',
  },
  {
    id: 2,
    manufacturer: 'B 고객사',
    subject: '보안 취약점 문의',
    status: '답변 대기',
    date: '2023. 7. 10.',
    message: '보안 취약점 패치가 언제 제공되나요?',
    response: '',
  },
];
