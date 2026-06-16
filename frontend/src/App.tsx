import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

export default App
