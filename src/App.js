import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SearchProvider } from './context/SearchContext';
import Home from './pages/Home';
import PdfTools from './pages/PdfTools';
import ImageTools from './pages/ImageTools';
import CalculatorTools from './pages/CalculatorTools';
import CompressPdf from './pages/CompressPdf';
import DeletePdfPages from './pages/DeletePdfPages';
import DjvuToPdf from './pages/DjvuToPdf';
import EpsToPdf from './pages/EpsToPdf';
import EpubToPdf from './pages/EpubToPdf';
import GifToPdf from './pages/GifToPdf';
import HeicToPdf from './pages/HeicToPdf';
import HtmlToPdf from './pages/HtmlToPdf';
import IcoToPdf from './pages/IcoToPdf';
import JpgToPdf from './pages/JpgToPdf';
import MergePdf from './pages/MergePdf';
import MobiToPdf from './pages/MobiToPdf';
import MsgToPdf from './pages/MsgToPdf';
import OfficeToPdf from './pages/OfficeToPdf';
import PdfOcr from './pages/PdfOcr';
import PdfToHtml from './pages/PdfToHtml';
import PdfToWord from './pages/PdfToWord';
import WordToPdf from './pages/WordToPdf';
import SplitPdf from './pages/SplitPdf';
import PdfToPptx from './pages/PdfToPptx';
import PdfToTxt from './pages/PdfToTxt';
import PngToPdf from './pages/PngToPdf';
import ProtectPdf from './pages/ProtectPdf';
import RotatePdf from './pages/RotatePdf';
import TiffToPdf from './pages/TiffToPdf';
import TxtToPdf from './pages/TxtToPdf';
import UnlockPdf from './pages/UnlockPdf';
import WatermarkPdf from './pages/WatermarkPdf';
import WebpToPdf from './pages/WebpToPdf';
import WebToPdf from './pages/WebToPdf';
import AiImageGenerator from './pages/AiImageGenerator';
import AiToPng from './pages/AiToPng';
import AiToWebp from './pages/AiToWebp';
import BmpToJpg from './pages/BmpToJpg';
import BmpToPng from './pages/BmpToPng';
import BmpToPnm from './pages/BmpToPnm';
import DownloaderTools from './pages/DownloaderTools';
import YoutubeDownloader from './pages/YoutubeDownloader';
import TiktokDownloader from './pages/TiktokDownloader';
import InstagramDownloader from './pages/InstagramDownloader';
import FacebookDownloader from './pages/FacebookDownloader';
import BmpToSvg from './pages/BmpToSvg';
import BmpToWebp from './pages/BmpToWebp';
import ColorPicker from './pages/ColorPicker';
import DjvuToJpg from './pages/DjvuToJpg';
import DocToJpg from './pages/DocToJpg';
import DocToPng from './pages/DocToPng';
import DwfToWebp from './pages/DwfToWebp';
import EpubToJpg from './pages/EpubToJpg';
import GifToJpg from './pages/GifToJpg';
import HeicToJpg from './pages/HeicToJpg';
import ImageCompressor from './pages/ImageCompressor';
import ImageConverter from './pages/ImageConverter';
import ImageCropper from './pages/ImageCropper';
import ImageResizer from './pages/ImageResizer';
import JpgToPng from './pages/JpgToPng';
import PdfToJpg from './pages/PdfToJpg';
import PdfToPng from './pages/PdfToPng';
import PdfToSvg from './pages/PdfToSvg';
import WebpToSvg from './pages/WebpToSvg';
import AgeCalculator from './pages/AgeCalculator';
import AspectRatioCalculator from './pages/AspectRatioCalculator';
import BmiCalculator from './pages/BmiCalculator';
import BmrCalculator from './pages/BmrCalculator';
import BreakevenPointCalculator from './pages/BreakevenPointCalculator';
import CalorieCalculator from './pages/CalorieCalculator';
import ConcreteCalculator from './pages/ConcreteCalculator';
import DateCalculator from './pages/DateCalculator';
import DiscountCalculator from './pages/DiscountCalculator';
import DueDateCalculator from './pages/DueDateCalculator';
import FlooringCalculator from './pages/FlooringCalculator';
import FreelanceRateCalculator from './pages/FreelanceRateCalculator';
import FuelCostCalculator from './pages/FuelCostCalculator';
import GpaCalculator from './pages/GpaCalculator';
import HourlyToSalaryCalculator from './pages/HourlyToSalaryCalculator';
import InterestCalculator from './pages/InterestCalculator';
import LengthConverter from './pages/LengthConverter';
import OhmsLawCalculator from './pages/OhmsLawCalculator';
import PaceCalculator from './pages/PaceCalculator';
import PaintCalculator from './pages/PaintCalculator';
import PasswordStrengthChecker from './pages/PasswordStrengthChecker';
import PercentageCalculator from './pages/PercentageCalculator';
import ProfitMarginCalculator from './pages/ProfitMarginCalculator';
import SalesTaxCalculator from './pages/SalesTaxCalculator';
import RecipeScaler from './pages/RecipeScaler';
import StitchCounter from './pages/StitchCounter';
import TemperatureConverter from './pages/TemperatureConverter';
import TimeCardCalculator from './pages/TimeCardCalculator';
import TipCalculator from './pages/TipCalculator';
import WeightConverter from './pages/WeightConverter';
import WordCounter from './pages/WordCounter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Disclaimer from './pages/Disclaimer';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

// ── Expiration Logic ─────────────────────────────────────────────────────────
const ExpirationWrapper = ({ children }) => {
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    const HOURS_24 = 24 * 60 * 60 * 1000;
    const startTime = localStorage.getItem('app_deployment_timestamp');
    
    if (!startTime) {
      // Set the first-seen timestamp
      localStorage.setItem('app_deployment_timestamp', Date.now().toString());
    } else {
      const elapsed = Date.now() - parseInt(startTime);
      if (elapsed > HOURS_24) {
        setIsExpired(true);
      }
    }

    // Optional: Real-time check interval
    const interval = setInterval(() => {
      const stored = localStorage.getItem('app_deployment_timestamp');
      if (stored && Date.now() - parseInt(stored) > HOURS_24) {
        setIsExpired(true);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (isExpired) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 mb-10 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-2xl shadow-rose-500/20 ring-1 ring-rose-500/50">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
          Trial <span className="text-rose-500">Expired</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed border-t border-slate-800 pt-6">
          The 24-hour trial period for this application has concluded. 
          To continue using these tools, please contact your developer or administrator.
        </p>
        <div className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
          Access Code: ERR_TRIAL_EXPIRED
        </div>
      </div>
    );
  }

  return children;
};

function AppLayout() {
  const location = useLocation();
  const hideFooter = ['/image-cropper', '/pdf-to-jpg', '/pdf-to-png', '/pdf-to-svg', '/webp-to-svg'].includes(
    location.pathname
  );

  return (
    <SearchProvider>
    <div className="App selection:bg-brand-blue selection:text-white bg-white min-h-screen font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pdf-tools" element={<PdfTools />} />
          <Route path="/image-tools" element={<ImageTools />} />
          <Route path="/calculator-tools" element={<CalculatorTools />} />
          <Route path="/ai-image-generator" element={<AiImageGenerator />} />
          <Route path="/ai-to-png" element={<AiToPng />} />
          <Route path="/ai-to-webp" element={<AiToWebp />} />
          <Route path="/bmp-to-jpg" element={<BmpToJpg />} />
          <Route path="/bmp-to-png" element={<BmpToPng />} />
          <Route path="/bmp-to-pnm" element={<BmpToPnm />} />
          <Route path="/bmp-to-svg" element={<BmpToSvg />} />
          <Route path="/bmp-to-webp" element={<BmpToWebp />} />
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/djvu-to-jpg" element={<DjvuToJpg />} />
          <Route path="/doc-to-jpg" element={<DocToJpg />} />
          <Route path="/doc-to-png" element={<DocToPng />} />
          <Route path="/dwf-to-webp" element={<DwfToWebp />} />
          <Route path="/epub-to-jpg" element={<EpubToJpg />} />
          <Route path="/gif-to-jpg" element={<GifToJpg />} />
          <Route path="/heic-to-jpg" element={<HeicToJpg />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/image-cropper" element={<ImageCropper />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/jpg-to-png" element={<JpgToPng />} />
          <Route path="/webp-to-svg" element={<WebpToSvg />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/aspect-ratio-calculator" element={<AspectRatioCalculator />} />
          <Route path="/bmi-calculator" element={<BmiCalculator />} />
          <Route path="/bmr-calculator" element={<BmrCalculator />} />
          <Route path="/breakeven-point-calculator" element={<BreakevenPointCalculator />} />
          <Route path="/calorie-calculator" element={<CalorieCalculator />} />
          <Route path="/concrete-calculator" element={<ConcreteCalculator />} />
          <Route path="/date-calculator" element={<DateCalculator />} />
          <Route path="/discount-calculator" element={<DiscountCalculator />} />
          <Route path="/due-date-calculator" element={<DueDateCalculator />} />
          <Route path="/flooring-calculator" element={<FlooringCalculator />} />
          <Route path="/freelance-rate-calculator" element={<FreelanceRateCalculator />} />
          <Route path="/fuel-cost-calculator" element={<FuelCostCalculator />} />
          <Route path="/gpa-calculator" element={<GpaCalculator />} />
          <Route path="/hourly-to-salary-calculator" element={<HourlyToSalaryCalculator />} />
          <Route path="/interest-calculator" element={<InterestCalculator />} />
          <Route path="/length-converter" element={<LengthConverter />} />
          <Route path="/ohms-law-calculator" element={<OhmsLawCalculator />} />
          <Route path="/pace-calculator" element={<PaceCalculator />} />
          <Route path="/paint-calculator" element={<PaintCalculator />} />
          <Route path="/password-strength-checker" element={<PasswordStrengthChecker />} />
          <Route path="/percentage-calculator" element={<PercentageCalculator />} />
          <Route path="/profit-margin-calculator" element={<ProfitMarginCalculator />} />
          <Route path="/sales-tax-calculator" element={<SalesTaxCalculator />} />
          <Route path="/recipe-scaler" element={<RecipeScaler />} />
          <Route path="/stitch-counter" element={<StitchCounter />} />
          <Route path="/temperature-converter" element={<TemperatureConverter />} />
          <Route path="/time-card-calculator" element={<TimeCardCalculator />} />
          <Route path="/tip-calculator" element={<TipCalculator />} />
          <Route path="/weight-converter" element={<WeightConverter />} />
          <Route path="/word-counter" element={<WordCounter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="/pdf-to-png" element={<PdfToPng />} />
          <Route path="/pdf-to-svg" element={<PdfToSvg />} />
          <Route path="/compress-pdf" element={<CompressPdf />} />
          <Route path="/delete-pages" element={<DeletePdfPages />} />
          <Route path="/djvu-to-pdf" element={<DjvuToPdf />} />
          <Route path="/eps-to-pdf" element={<EpsToPdf />} />
          <Route path="/epub-to-pdf" element={<EpubToPdf />} />
          <Route path="/gif-to-pdf" element={<GifToPdf />} />
          <Route path="/heic-to-pdf" element={<HeicToPdf />} />
          <Route path="/html-to-pdf" element={<HtmlToPdf />} />
          <Route path="/ico-to-pdf" element={<IcoToPdf />} />
          <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/mobi-to-pdf" element={<MobiToPdf />} />
          <Route path="/msg-to-pdf" element={<MsgToPdf />} />
          <Route path="/office-to-pdf" element={<OfficeToPdf />} />
          <Route path="/pdf-ocr" element={<PdfOcr />} />
          <Route path="/pdf-to-html" element={<PdfToHtml />} />
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/word-to-pdf" element={<WordToPdf />} />
          <Route path="/split-pdf" element={<SplitPdf />} />
          <Route path="/pdf-to-pptx" element={<PdfToPptx />} />
          <Route path="/pdf-to-txt" element={<PdfToTxt />} />
          <Route path="/png-to-pdf" element={<PngToPdf />} />
          <Route path="/protect-pdf" element={<ProtectPdf />} />
          <Route path="/rotate-pdf" element={<RotatePdf />} />
          <Route path="/tiff-to-pdf" element={<TiffToPdf />} />
          <Route path="/txt-to-pdf" element={<TxtToPdf />} />
          <Route path="/unlock-pdf" element={<UnlockPdf />} />
          <Route path="/watermark-pdf" element={<WatermarkPdf />} />
          <Route path="/webp-to-pdf" element={<WebpToPdf />} />
          <Route path="/web-to-pdf" element={<WebToPdf />} />
          <Route path="/downloader-tools" element={<DownloaderTools />} />
          <Route path="/youtube-video-downloader" element={<YoutubeDownloader />} />
          <Route path="/tiktok-video-downloader" element={<TiktokDownloader />} />
          <Route path="/instagram-video-downloader" element={<InstagramDownloader />} />
          <Route path="/facebook-video-downloader" element={<FacebookDownloader />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
    </SearchProvider>
  );
}

function App() {
  return (
    <Router>
      <ExpirationWrapper>
        <AppLayout />
      </ExpirationWrapper>
    </Router>
  );
}

export default App;
