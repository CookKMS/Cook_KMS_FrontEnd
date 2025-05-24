import React, { useState } from "react";
import "./App.css";

// ✅ 컴포넌트 import
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import RelatedQuestions from "./components/RelatedQuestions";
import DetailContent from "./components/DetailContent";
import InquiryForm from "./components/InquiryForm";
import InquiryList from "./components/InquiryList";
// import Footer from "./components/Footer"; // 아직 구현 안 했으면 주석 처리

function App() {
  const [currentPage, setCurrentPage] = useState("main");

  // 메인 화면
  const renderMainPage = () => (
    <div className="main-page fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar />
        <MainContent onSelectDetail={() => setCurrentPage("detail")} />
        <RelatedQuestions />
      </div>
    </div>
  );

  // 화면 전환
  const renderContent = () => {
    switch (currentPage) {
      case "detail":
        return (
          <div className="detail-page fade-in flex flex-col md:flex-row gap-6">
            <DetailContent onBack={() => setCurrentPage("main")} />
            <RelatedQuestions />
          </div>
        );
      case "inquiryForm":
        return <InquiryForm onBack={() => setCurrentPage("main")} />;
      case "inquiryList":
        return <InquiryList />;
      default:
        return renderMainPage();
    }
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Header setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-6">
        <Tabs currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {renderContent()}
      </main>
      {/* <Footer /> */} {/* 필요 시 생성 후 주석 해제 */}
    </div>
  );
}

export default App;
