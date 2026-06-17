import { Toaster } from './components/ui/toaster'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from './lib/AuthContext';
import UserNotRegisteredError from './components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
// Add page imports here
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ForgotPassword from './pages/register/ForgotPassword';
import ResetPassword from './pages/register/ResetPassword';
import Home from './pages/home/Home';
import ArticleDetail from './pages/articles/ArticleDetail';
import MyArticles from './pages/articles/MyArticles';
import MyProfile from './pages/home/MyProfile';
import AddArticle from './pages/articles/AddArticle';
import EditArticle from './pages/articles/EditArticle';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public routes */}

      {/* Layout-wrapped routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/articol/:id" element={<ArticleDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/articolele-mele" element={<MyArticles />} />
          <Route path="/profilul-meu" element={<MyProfile />} />
          <Route path="/adauga-articol" element={<AddArticle />} />
          <Route path="/editeaza-articol/:id" element={<EditArticle />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
  /*return (
    <Routes>
      {/* Public routes *}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Layout-wrapped routes *}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/articol/:id" element={<ArticleDetail />} />

        {/* Protected routes *}
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/articolele-mele" element={<MyArticles />} />
          <Route path="/profilul-meu" element={<MyProfile />} />
          <Route path="/adauga-articol" element={<AddArticle />} />
          <Route path="/editeaza-articol/:id" element={<EditArticle />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );*/
};


function App() {

return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}
/*return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}
*/
export default App

/*import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Footer } from './components/Footer/Footer'
import { Home } from './pages/Home/Home'
import { TestPage } from './pages/testPage'
import Login from './pages/login/login'
import Register from './pages/register/register'
import { CreateArticle } from './pages/articles/CreateArticle'
import { ArticlePage } from './pages/articles/ArticlePage'
import { EditArticle } from './pages/articles/EditArticle'
import { MyArticles } from './pages/articles/MyArticles'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/articles/new" element={<CreateArticle />} />
        <Route path="/my-articles" element={<MyArticles />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/article/:id/edit" element={<EditArticle />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App*/
