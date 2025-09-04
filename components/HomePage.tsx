
import React from 'react';
import PdfIcon from './icons/PdfIcon';
import AnalyzeIcon from './icons/AnalyzeIcon';
import ChatIcon from './icons/ChatIcon';

interface HomePageProps {
  onEnterApp: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEnterApp }) => {
  return (
    <div className="text-center">
      <section className="py-20">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
          موريافي AI
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          مساعدك الذكي لتحليل الصور، تحويلها إلى PDF، والآن... محادثة تفاعلية للحصول على إجابات فورية ودقيقة.
        </p>
        <button
          onClick={onEnterApp}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          ابدأ التجربة الآن
        </button>
      </section>

      <section className="py-16 bg-gray-900/50 rounded-xl">
        <h2 className="text-4xl font-bold mb-12">المميزات الرئيسية</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex justify-center items-center mb-4 bg-purple-500/10 rounded-full h-16 w-16 mx-auto">
              <PdfIcon />
            </div>
            <h3 className="text-2xl font-bold mb-3">تحويل الصور إلى PDF</h3>
            <p className="text-gray-400">
              ارفع صورك بسهولة، وأنشئ ملف PDF احترافي وجاهز للمشاركة أو الطباعة بنقرة واحدة.
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex justify-center items-center mb-4 bg-teal-500/10 rounded-full h-16 w-16 mx-auto">
              <ChatIcon />
            </div>
            <h3 className="text-2xl font-bold mb-3">محادثة ذكية</h3>
            <p className="text-gray-400">
              تحدث مع موريافي واحصل على إجابات فورية. اسأله عن أوقات الصلاة في مدن المملكة بدقة عالية.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex justify-center items-center mb-4 bg-indigo-500/10 rounded-full h-16 w-16 mx-auto">
              <AnalyzeIcon />
            </div>
            <h3 className="text-2xl font-bold mb-3">تحليل الصور الذكي</h3>
            <p className="text-gray-400">
              استخدم قوة الذكاء الاصطناعي لفهم محتوى صورك، استخراج النصوص، والتعرف على العناصر.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
         <h2 className="text-4xl font-bold mb-6">عن الذكاء الاصطناعي</h2>
         <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            يستخدم موريافي AI أحدث نماذج الذكاء الاصطناعي التوليدي من Google Gemini لفهم الصور وتحليلها وإجراء محادثات ذكية وتقديم معلومات دقيقة مثل أوقات الصلاة، مما يضمن لك نتائج سريعة وموثوقة.
         </p>
      </section>
    </div>
  );
};

export default HomePage;
