import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { Button } from "./ui/button";
import { HardHat, Menu, X, LogOut, User, FileText, PlusCircle, Home } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(true);
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <HardHat className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              Bursa de <span className="text-primary">Construcții</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              <Home className="w-4 h-4" /> Acasă
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/adauga-articol"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Adaugă articol
                </Link>
                <Link
                  to="/articolele-mele"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                >
                  <FileText className="w-4 h-4" /> {isAdmin ? "Toate articolele" : "Articolele mele"}
                </Link>
                <Link
                  to="/profilul-meu"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                >
                  <User className="w-4 h-4" /> Profilul meu
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" /> Deconectare
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-sm font-medium">
                    Conectare
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="text-sm font-medium">
                    Înregistrare
                  </Button>
                </Link>
              </>
            )}
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Meniu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              <Home className="w-4 h-4" /> Acasă
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/adauga-articol"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Adaugă articol
                </Link>
                <Link
                  to="/articolele-mele"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                >
                  <FileText className="w-4 h-4" /> {isAdmin ? "Toate articolele" : "Articolele mele"}
                </Link>
                <Link
                  to="/profilul-meu"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                >
                  <User className="w-4 h-4" /> Profilul meu
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-destructive rounded-lg hover:bg-secondary transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Deconectare
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                >
                  Conectare
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-primary rounded-lg hover:bg-secondary transition-colors"
                >
                  Înregistrare
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}